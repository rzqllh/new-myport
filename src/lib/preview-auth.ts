import { SignJWT, jwtVerify } from "jose";

export type PreviewResourceType = "work" | "insight";

export interface PreviewTokenClaims {
  resourceType: PreviewResourceType;
  resourceId: string;
  locale: "en" | "id";
}

function previewSecret() {
  const configured =
    process.env.PREVIEW_TOKEN_SECRET ?? process.env.CHAT_SESSION_SECRET;

  if (configured) return new TextEncoder().encode(configured);

  if (process.env.NODE_ENV === "production") {
    throw new Error("PREVIEW_TOKEN_SECRET is not configured.");
  }

  return new TextEncoder().encode("development-only-preview-secret");
}

export async function signPreviewToken(claims: PreviewTokenClaims) {
  return new SignJWT({
    resourceType: claims.resourceType,
    resourceId: claims.resourceId,
    locale: claims.locale,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("portfolio-admin")
    .setAudience("portfolio-preview")
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(previewSecret());
}

export async function verifyPreviewToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, previewSecret(), {
      issuer: "portfolio-admin",
      audience: "portfolio-preview",
    });

    if (
      (payload.resourceType !== "work" &&
        payload.resourceType !== "insight") ||
      typeof payload.resourceId !== "string" ||
      (payload.locale !== "en" && payload.locale !== "id")
    ) {
      return null;
    }

    return {
      resourceType: payload.resourceType,
      resourceId: payload.resourceId,
      locale: payload.locale,
    } satisfies PreviewTokenClaims;
  } catch {
    return null;
  }
}
