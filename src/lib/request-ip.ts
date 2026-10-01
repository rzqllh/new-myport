export function getRequestIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate =
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown";

  const normalized = candidate
    .slice(0, 128)
    .replace(/[^0-9a-fA-F:.-]/g, "");

  return normalized || "unknown";
}
