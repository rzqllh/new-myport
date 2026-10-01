"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/chat-auth";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5_000),
});

export async function submitContact(
  prevState: unknown,
  formData: FormData
) {
  void prevState;

  const honeypot = String(formData.get("website_url") || "").trim();

  if (honeypot) {
    return { success: true };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form and complete all required fields.",
    };
  }

  const requestHeaders = await headers();
  const ip = getRequestIp(requestHeaders);
  const rateLimit = await checkContactRateLimit(ip);

  if (rateLimit.configured && !rateLimit.success) {
    return {
      success: false,
      error: "Too many messages were submitted recently. Please try again later.",
    };
  }

  const token = String(formData.get("cf-turnstile-response") || "");

  try {
    const verified = await verifyTurnstileToken(token, ip);

    if (!verified) {
      return {
        success: false,
        error: "Security verification failed. Please refresh and try again.",
      };
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return {
      success: false,
      error: "Unable to verify the security challenge right now.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contacts").insert({
      ...parsed.data,
      status: "new",
    });

    if (error) {
      console.error("Contact form database insert error:", error);
      return {
        success: false,
        error: "Unable to send your message right now. Please use direct email instead.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected contact form error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
