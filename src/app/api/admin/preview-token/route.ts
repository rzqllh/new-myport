import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortfolioAdminClient } from "@/lib/admin-auth";
import { signPreviewToken } from "@/lib/preview-auth";

const requestSchema = z.object({
  resourceType: z.enum(["work", "insight"]),
  resourceId: z.string().uuid(),
  locale: z.enum(["en", "id"]),
});

export async function POST(request: Request) {
  const admin = await getPortfolioAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid preview request" }, { status: 400 });
  }

  const token = await signPreviewToken(parsed.data);
  return NextResponse.json({ token, expiresInSeconds: 900 });
}
