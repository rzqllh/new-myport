import { NextResponse } from "next/server";
import { getPortfolioAdminClient } from "@/lib/admin-auth";
import { logOperationalEvent } from "@/lib/observability";

const backupTables = [
  "work_items",
  "work_translations",
  "work_media",
  "work_evidence",
  "work_evidence_translations",
  "insights",
  "insight_translations",
  "media_assets",
  "media_translations",
  "site_content",
  "content_redirects",
  "experiences",
  "experience_translations",
  "capabilities",
  "capability_translations",
  "testimonials",
  "site_settings",
  "about",
  "content_revisions",
] as const;

export async function GET() {
  const admin = await getPortfolioAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data: Record<string, unknown[]> = {};

  for (const table of backupTables) {
    const result = await admin.supabase.from(table).select("*");
    if (result.error) {
      logOperationalEvent({
        event: "admin.backup_failed",
        severity: "error",
        route: "/api/admin/export",
        status: 500,
        reason: "database_read_failed",
      });
      return NextResponse.json(
        { error: "Unable to export portfolio content" },
        { status: 500 }
      );
    }
    data[table] = result.data ?? [];
  }

  const generatedAt = new Date().toISOString();
  const body = JSON.stringify(
    {
      schemaVersion: 1,
      generatedAt,
      scope: "portfolio-content",
      data,
    },
    null,
    2
  );

  logOperationalEvent({
    event: "admin.backup_exported",
    route: "/api/admin/export",
    status: 200,
  });

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="portfolio-content-backup.json"',
      "Cache-Control": "no-store",
    },
  });
}
