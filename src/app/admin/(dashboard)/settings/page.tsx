import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Settings — Admin",
};

export default async function SettingsAdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Failed to load settings: {error.message}
      </div>
    );
  }

  // Convert rows to a map: { general: {...}, social: {...}, ... }
  const settings = Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value])
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure site metadata, social links, SEO defaults, and CV.
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
