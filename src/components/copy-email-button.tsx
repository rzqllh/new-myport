"use client";

import { useState } from "react";
import { EnvelopeSimple, Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CopyEmailButtonProps {
  email?: string;
  className?: string;
  variant?: "button" | "badge" | "icon";
}

export function CopyEmailButton({
  email = "hrizqullah484@gmail.com",
  className,
  variant = "button",
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      window.location.href = `mailto:${email}`;
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleCopy}
        type="button"
        title={copied ? "Email copied!" : `Copy email (${email})`}
        aria-label={copied ? "Email copied!" : "Copy email address"}
        className={cn(
          "size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all shadow-sm relative",
          copied && "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          className
        )}
      >
        {copied ? (
          <Check weight="bold" size={18} className="text-emerald-500" />
        ) : (
          <EnvelopeSimple weight="fill" size={20} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted/70 text-xs font-medium text-muted-foreground hover:text-foreground transition-all shadow-sm",
        copied && "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        className
      )}
    >
      {copied ? (
        <>
          <Check weight="bold" className="size-3.5 text-emerald-500" />
          <span>Email copied!</span>
        </>
      ) : (
        <>
          <Copy weight="bold" className="size-3.5" />
          <span>Copy email</span>
        </>
      )}
    </button>
  );
}
