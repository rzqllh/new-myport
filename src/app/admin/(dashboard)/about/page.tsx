import { createClient } from "@/lib/supabase/server";
import { AboutForm } from "./about-form";

export const metadata = {
  title: "About — Admin",
};

export default async function AboutAdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("about")
    .select("*")
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    return (
      <div className="text-destructive text-sm">
        Failed to load about data: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">About</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Edit the bio and personal information shown on the About page.
        </p>
      </div>
      <AboutForm initialData={data ?? null} />
    </div>
  );
}
