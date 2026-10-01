import { createClient } from "@/lib/supabase/server";
import { AboutForm } from "./about-form";

export const metadata = {
  title: "Profile — Admin",
};

export default async function AboutAdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("about")
    .select("id, photo_url")
    .limit(1)
    .maybeSingle();

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Failed to load profile media: {error.message}
      </div>
    );
  }

  return <AboutForm initialData={data ?? null} />;
}
