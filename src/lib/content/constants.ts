import type { Locale } from "@/types/content";

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES = ["en", "id"] as const;

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function localePrefix(locale: Locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}
