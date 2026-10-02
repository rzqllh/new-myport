function normalizeOrigin(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const candidate = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : "https://" + trimmed;
    return new URL(candidate).origin;
  } catch {
    return null;
  }
}

function configuredOrigins() {
  return [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ]
    .map(normalizeOrigin)
    .filter((value): value is string => Boolean(value));
}

export function isAllowedWriteOrigin(request: Request) {
  const provided = normalizeOrigin(request.headers.get("origin"));

  if (!provided) {
    return process.env.NODE_ENV !== "production";
  }

  const allowed = new Set<string>([
    new URL(request.url).origin,
    ...configuredOrigins(),
  ]);

  return allowed.has(provided);
}
