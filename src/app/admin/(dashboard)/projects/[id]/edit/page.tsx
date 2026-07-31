import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl">Edit Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update the details of your project.
        </p>
      </div>

      <div className="bg-background rounded-xl border p-6">
        <ProjectForm initialData={project} />
      </div>
    </div>
  );
}
