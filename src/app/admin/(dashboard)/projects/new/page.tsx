import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl">New Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add a new case study or project to your portfolio.
        </p>
      </div>

      <div className="bg-background rounded-xl border p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
