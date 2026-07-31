"use client";

import { useActionState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // If successfully submitted
  if (state?.success) {
    return (
      <div className="p-8 md:p-12 text-center rounded-3xl border border-border bg-muted/30">
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
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            disabled={isPending}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
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
          Message <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project, timeline, and goals..."
          required
          disabled={isPending}
          className="min-h-[160px] resize-y bg-muted/50"
        />
      </div>

      {siteKey && (
        <div className="flex justify-start">
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            options={{
              theme: "auto",
            }}
          />
        </div>
      )}

      {state?.error && (
        <p className="text-sm text-destructive font-medium">{state.error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isPending || !siteKey}
        className={cn("w-full sm:w-auto", isPending && "opacity-70")}
      >
        {isPending ? "Sending..." : "Send Message"}
        {!isPending && <PaperPlaneRight weight="bold" data-icon="inline-end" />}
      </Button>
    </form>
  );
}
