function firstAddress(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function normalizeIp(value: string | null) {
  if (!value) return null;

  const normalized = value
    .slice(0, 128)
    .replace(/[^0-9a-fA-F:.-]/g, "");

  return normalized || null;
}

export function getRequestIp(headers: Headers) {
  const candidates = [
    firstAddress(headers.get("x-vercel-forwarded-for")),
    firstAddress(headers.get("x-forwarded-for")),
    headers.get("cf-ray") ? firstAddress(headers.get("cf-connecting-ip")) : null,
    firstAddress(headers.get("x-real-ip")),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeIp(candidate);
    if (normalized) return normalized;
  }

  return "unknown";
}
