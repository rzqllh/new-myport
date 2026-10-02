import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortfolioAdminClient } from "@/lib/admin-auth";
import { PUBLIC_CONTENT_CACHE_TAG } from "@/lib/content/public-cache";
import { logOperationalEvent } from "@/lib/observability";

const requestSchema = z.object({
  revisionId: z.string().uuid(),
});

function pickSnapshot(
  snapshot: Record<string, unknown>,
  fields: readonly string[]
) {
  return Object.fromEntries(
    fields
      .filter((field) => Object.prototype.hasOwnProperty.call(snapshot, field))
      .map((field) => [field, snapshot[field]])
  );
}

export async function POST(request: Request) {
  const admin = await getPortfolioAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid revision request" }, { status: 400 });
  }

  const { supabase } = admin;
  const { data: revision, error: revisionError } = await supabase
    .from("content_revisions")
    .select("id, resource_type, resource_id, locale, snapshot")
    .eq("id", parsed.data.revisionId)
    .single();

  if (revisionError || !revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 });
  }

  const snapshot = revision.snapshot as Record<string, unknown>;
  let operationError: { message?: string } | null = null;

  if (revision.resource_type === "work_translation") {
    const fields = [
      "status",
      "title",
      "short_title",
      "summary",
      "role",
      "context",
      "challenge",
      "approach",
      "decisions",
      "outcome",
      "lessons",
      "seo_title",
      "seo_description",
    ] as const;

    const result = await supabase
      .from("work_translations")
      .update(pickSnapshot(snapshot, fields))
      .eq("work_id", revision.resource_id)
      .eq("locale", revision.locale);
    operationError = result.error;
  } else if (revision.resource_type === "insight_translation") {
    const fields = [
      "status",
      "title",
      "excerpt",
      "body",
      "seo_title",
      "seo_description",
    ] as const;

    const result = await supabase
      .from("insight_translations")
      .update(pickSnapshot(snapshot, fields))
      .eq("insight_id", revision.resource_id)
      .eq("locale", revision.locale);
    operationError = result.error;
  } else if (revision.resource_type === "site_content") {
    const result = await supabase
      .from("site_content")
      .update(pickSnapshot(snapshot, ["status", "content"]))
      .eq("namespace", revision.resource_id)
      .eq("locale", revision.locale);
    operationError = result.error;
  } else {
    return NextResponse.json({ error: "Unsupported revision type" }, { status: 400 });
  }

  if (operationError) {
    logOperationalEvent({
      event: "admin.revision_restore_failed",
      severity: "error",
      route: "/api/admin/revisions/restore",
      status: 500,
      reason: "database_update_failed",
    });
    return NextResponse.json({ error: "Unable to restore revision" }, { status: 500 });
  }

  revalidateTag(PUBLIC_CONTENT_CACHE_TAG, "max");
  logOperationalEvent({
    event: "admin.revision_restored",
    route: "/api/admin/revisions/restore",
    status: 200,
  });

  return NextResponse.json({ restored: true });
}
