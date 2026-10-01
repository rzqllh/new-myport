import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Settings — Admin" };

export default async function SettingsAdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  const settings = Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value])
  ) as Record<string, Record<string, string>>;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Settings"
        description="Operational site data, integrations-facing metadata, profile facts, and resume links. Public page copy is managed separately in Site Content."
      />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          Settings could not be loaded. Existing defaults are shown where available.
        </p>
      ) : null}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
