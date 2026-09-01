"use client";

import { useLocale } from "next-intl";

export function LanguageToggle() {
  const locale = useLocale();
  const nextLocale = locale === "id" ? "en" : "id";

  function changeLocale() {
    document.cookie = `portfolio_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={changeLocale}
      className="min-w-10 border-l border-border pl-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
