"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/chat-auth";
import { logOperationalEvent } from "@/lib/observability";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";
import type { Locale } from "@/types/content";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5_000),
});

const messages = {
  en: {
    invalid: "Please check the form and complete all required fields.",
    rate: "Too many messages were submitted recently. Please try again later.",
    rateUnavailable: "The contact form is temporarily unavailable. Please use direct email instead.",
    verify: "Security verification failed. Please refresh and try again.",
    verifyUnavailable: "Unable to verify the security challenge right now.",
    database: "Unable to send your message right now. Please use direct email instead.",
    unexpected: "An unexpected error occurred. Please try again later.",
  },
  id: {
    invalid: "Periksa kembali formulir dan lengkapi semua field yang wajib.",
    rate: "Terlalu banyak pesan dikirim dalam waktu dekat. Coba lagi nanti.",
    rateUnavailable: "Formulir kontak sedang tidak tersedia. Silakan gunakan email langsung.",
    verify: "Verifikasi keamanan gagal. Muat ulang halaman lalu coba lagi.",
    verifyUnavailable: "Verifikasi keamanan sedang tidak tersedia.",
    database: "Pesan belum dapat dikirim. Silakan gunakan email langsung.",
    unexpected: "Terjadi kendala tak terduga. Silakan coba lagi nanti.",
  },
} as const;

export async function submitContact(
  prevState: unknown,
  formData: FormData
) {
  void prevState;

  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const locale: Locale =
    String(formData.get("locale") || "") === "id" ? "id" : "en";
  const copy = messages[locale];
  const honeypot = String(formData.get("website_url") || "").trim();

  if (honeypot) {
    logOperationalEvent({
      event: "contact.honeypot",
      severity: "warn",
      requestId,
      route: "/contact",
      status: 200,
    });
    return { success: true };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, error: copy.invalid };
  }

  const requestHeaders = await headers();
  const ip = getRequestIp(requestHeaders);
  const rateLimit = await checkContactRateLimit(ip);

  if (!rateLimit.configured && process.env.NODE_ENV === "production") {
    logOperationalEvent({
      event: "contact.rate_limit_unavailable",
      severity: "error",
      requestId,
      route: "/contact",
      status: 503,
    });
    return { success: false, error: copy.rateUnavailable };
  }

  if (!rateLimit.success) {
    logOperationalEvent({
      event: "contact.rate_limited",
      severity: "warn",
      requestId,
      route: "/contact",
      status: 429,
    });
    return { success: false, error: copy.rate };
  }

  const token = String(formData.get("cf-turnstile-response") || "");

  try {
    const verified = await verifyTurnstileToken(token, ip);

    if (!verified) {
      logOperationalEvent({
        event: "contact.verification_failed",
        severity: "warn",
        requestId,
        route: "/contact",
        status: 400,
      });
      return { success: false, error: copy.verify };
    }
  } catch {
    logOperationalEvent({
      event: "contact.verification_unavailable",
      severity: "error",
      requestId,
      route: "/contact",
      status: 503,
    });
    return { success: false, error: copy.verifyUnavailable };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contacts").insert({
      ...parsed.data,
      status: "new",
    });

    if (error) {
      logOperationalEvent({
        event: "contact.persistence_failed",
        severity: "error",
        requestId,
        route: "/contact",
        status: 503,
        reason: "database_insert_failed",
      });
      return { success: false, error: copy.database };
    }

    logOperationalEvent({
      event: "contact.completed",
      requestId,
      route: "/contact",
      status: 200,
      durationMs: Date.now() - startedAt,
    });
    return { success: true };
  } catch {
    logOperationalEvent({
      event: "contact.failed",
      severity: "error",
      requestId,
      route: "/contact",
      status: 500,
      durationMs: Date.now() - startedAt,
      reason: "internal_error",
    });
    return { success: false, error: copy.unexpected };
  }
}
