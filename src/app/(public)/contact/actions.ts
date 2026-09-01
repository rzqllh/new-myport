"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContact(
  prevState: unknown,
  formData: FormData
) {
  const name = (formData.get("name") as string || "").trim();
  const email = (formData.get("email") as string || "").trim();
  const message = (formData.get("message") as string || "").trim();
  const honeypot = (formData.get("website_url") as string || "").trim();
  const token = formData.get("cf-turnstile-response") as string;

  // 1. Honeypot check for automated bot spam
  if (honeypot) {
    // Bot trapped: return pseudo-success to deter retry loops without saving
    return { success: true };
  }

  // 2. Input validation
  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (name.length > 100) {
    return { success: false, error: "Name must be under 100 characters." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 254) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (message.length > 5000) {
    return { success: false, error: "Message must be under 5,000 characters." };
  }

  // 3. Authoritative Turnstile CAPTCHA Verification
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === "production";

  if (turnstileSecret) {
    if (!token) {
      return {
        success: false,
        error: "Please complete the security verification challenge.",
      };
    }

    try {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: token,
          }).toString(),
        }
      );

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        return {
          success: false,
          error: "Security verification challenge failed. Please refresh and try again.",
        };
      }
    } catch (err) {
      console.error("Turnstile verification error:", err);
      return {
        success: false,
        error: "Unable to verify security challenge. Please try again later.",
      };
    }
  } else if (isProduction) {
    // Production safety gate: Fail securely if Turnstile secret key is missing in production
    console.error("Critical: TURNSTILE_SECRET_KEY is not configured in production. Blocking submission.");
    return {
      success: false,
      error: "Message service is currently in secure maintenance mode. Please reach out directly via email.",
    };
  } else {
    // Development fallback: Rely on honeypot verification with console notice
    console.warn("Dev mode: TURNSTILE_SECRET_KEY missing; using honeypot spam protection fallback.");
  }

  // 4. Insert message into Supabase
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      message,
      status: "new",
    });

    if (error) {
      console.error("Contact form database insert error:", error);
      return {
        success: false,
        error: "Unable to send your message right now. Please try reaching out via email directly.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected contact form error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
