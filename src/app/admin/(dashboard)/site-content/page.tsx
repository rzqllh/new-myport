import { createClient } from "@/lib/supabase/server";
import { mergeSiteCopy } from "@/lib/content/site-copy";
import { SiteContentForm } from "./site-content-form";

export const metadata = { title: "Site Content — Admin" };

export default async function SiteContentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("namespace, locale, content");

  const rows = data ?? [];
  const en = mergeSiteCopy(
    "en",
    rows
      .filter((row) => row.locale === "en")
      .map((row) => ({
        namespace: row.namespace,
        content: (row.content ?? {}) as Record<string, unknown>,
      }))
  );
  const id = mergeSiteCopy(
    "id",
    rows
      .filter((row) => row.locale === "id")
      .map((row) => ({
        namespace: row.namespace,
        content: (row.content ?? {}) as Record<string, unknown>,
      }))
  );

  return <SiteContentForm initial={{ en, id }} />;
}
