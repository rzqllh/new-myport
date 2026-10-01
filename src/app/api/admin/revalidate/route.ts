import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PUBLIC_CONTENT_CACHE_TAG } from "@/lib/content/public-cache";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: isAdmin, error } = await supabase.rpc("is_portfolio_admin");

  if (error || isAdmin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  revalidateTag(PUBLIC_CONTENT_CACHE_TAG, "max");

  return NextResponse.json({ revalidated: true });
}
