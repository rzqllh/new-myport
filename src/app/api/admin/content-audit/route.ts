import { NextResponse } from "next/server";
import { getPortfolioAdminClient } from "@/lib/admin-auth";
import { getAdminContentHealth } from "@/lib/content/admin-content-health";

export async function GET() {
  const admin = await getPortfolioAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const health = await getAdminContentHealth();
  const generatedAt = new Date().toISOString();

  return new NextResponse(
    JSON.stringify(
      {
        generatedAt,
        schemaVersion: 1,
        scope: "portfolio-content-health",
        ...health,
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="portfolio-content-health.json"',
        "Cache-Control": "no-store",
      },
    }
  );
}
