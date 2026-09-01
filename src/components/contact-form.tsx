"use client";

import { useActionState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { submitContact } from "@/app/(public)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // If successfully submitted
  if (state?.success) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        className="p-8 md:p-12 text-center rounded-3xl border border-border bg-muted/30"
      >
        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <PaperPlaneRight weight="duotone" className="size-6" />
        </div>
        <h3 className="text-2xl font-display font-semibold tracking-tight text-foreground mb-3">
          Message Sent
        </h3>
        <p className="text-muted-foreground max-w-[40ch] mx-auto">
          Thanks for reaching out! I&apos;ll get back to you as soon as I can.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate={false}>
      {/* Honeypot field (hidden from screen readers & users, traps automated scrapers) */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            aria-required="true"
            disabled={isPending}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            aria-required="true"
            disabled={isPending}
            className="bg-muted/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-foreground"
        >
          Message <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project, timeline, and goals..."
          required
          aria-required="true"
          disabled={isPending}
          className="min-h-[160px] resize-y bg-muted/50"
        />
      </div>

      {siteKey ? (
        <div className="flex justify-start">
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            options={{
              theme: "auto",
            }}
          />
        </div>
      ) : null}

      {state?.error && (
        <div 
          role="alert" 
          className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
        >
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className={cn("w-full sm:w-auto rounded-xl shadow-xs font-semibold", isPending && "opacity-70")}
      >
        <span>{isPending ? "Sending..." : "Send Message"}</span>
        {!isPending && <PaperPlaneRight weight="bold" className="ml-1.5 size-4" />}
      </Button>
    </form>
  );
}

