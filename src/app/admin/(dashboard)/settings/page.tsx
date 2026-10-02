import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "./settings-form";
import { Button } from "@/components/ui/button";

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
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              render={<a href="/api/admin/content-audit" />}
              nativeButton={false}
            >
              Export content audit
            </Button>
            <Button
              variant="outline"
              render={<a href="/api/admin/export" />}
              nativeButton={false}
            >
              Export content backup
            </Button>
          </div>
        }
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
