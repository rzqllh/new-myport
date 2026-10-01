const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "new",
  "edit",
  "settings",
  "work",
  "insights",
  "about",
  "contact",
  "resume",
  "id",
]);

export function createSlug(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

export function validateSlug(slug: string) {
  if (slug.length < 2 || slug.length > 64) {
    return { valid: false, reason: "Slug must be between 2 and 64 characters." };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      valid: false,
      reason: "Use lowercase letters, numbers, and single hyphens only.",
    };
  }

  if (RESERVED_SLUGS.has(slug)) {
    return { valid: false, reason: "This slug is reserved by the application." };
  }

  return { valid: true, reason: null };
}
