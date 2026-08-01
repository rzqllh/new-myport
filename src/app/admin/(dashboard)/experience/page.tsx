import { createClient } from "@/lib/supabase/server";
import { ExperienceClient } from "./experience-client";

export const metadata = {
  title: "Experience — Admin",
};

export default async function ExperienceAdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order")
    .order("start_date", { ascending: false });

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Failed to load experiences: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Experience</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your work history shown on the About page.
        </p>
      </div>
      <ExperienceClient initialItems={data ?? []} />
    </div>
  );
}
