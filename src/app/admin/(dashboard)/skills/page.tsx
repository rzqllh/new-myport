import { createClient } from "@/lib/supabase/server";
import { SkillsClient } from "./skills-client";

export const metadata = {
  title: "Skills — Admin",
};

export default async function SkillsAdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("sort_order");

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Failed to load skills: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Skills</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your skills and proficiency levels.
        </p>
      </div>
      <SkillsClient initialSkills={data ?? []} />
    </div>
  );
}
