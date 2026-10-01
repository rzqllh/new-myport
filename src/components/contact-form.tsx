"use client";

import { useActionState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { submitContact } from "@/app/(public)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  if (state?.success) {
    return (
      <div role="status" aria-live="polite" className="border-y border-border py-8">
        <h3 className="font-display text-2xl font-semibold">Message sent</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Your message was submitted successfully.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_url">Leave this empty</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input id="name" name="name" required disabled={isPending} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <Textarea
          id="message"
          name="message"
          required
          disabled={isPending}
          className="min-h-44 resize-y"
          placeholder="Project, role, question, or relevant context"
        />
      </div>

      {siteKey ? (
        <Turnstile ref={turnstileRef} siteKey={siteKey} options={{ theme: "auto" }} />
      ) : null}

      {state?.error ? (
        <div
          role="alert"
          className="border-y border-destructive/30 bg-destructive/5 py-3 text-sm text-destructive"
        >
          {state.error}
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
