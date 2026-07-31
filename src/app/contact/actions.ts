"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContact(
  prevState: any,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const token = formData.get("cf-turnstile-response") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all fields." };
  }

  if (!token) {
    return { success: false, error: "Please complete the CAPTCHA." };
  }

  // 1. Verify Turnstile token
  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
    }
  );

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    return {
      success: false,
      error: "CAPTCHA verification failed. Please try again.",
    };
  }

  // 2. Insert into Supabase
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    name,
    email,
    message,
    status: "new",
  });

  if (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      error: "Something went wrong sending your message. Please try again.",
    };
  }

  return { success: true };
}
