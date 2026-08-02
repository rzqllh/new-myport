/* eslint-disable */
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, PencilSimple, Trash, Star } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-2xl">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your portfolio case studies and projects.
          </p>
        </div>
        <Button 
          render={<Link href="/admin/projects/new" />}
          nativeButton={false}
        >
          <Plus weight="bold" className="mr-2" />
          New Project
        </Button>
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-red-500">
                  <p className="font-semibold">Error fetching projects:</p>
                  <pre className="text-xs text-left inline-block max-w-[800px] whitespace-pre-wrap mt-2 p-2 bg-red-50/50 rounded-md">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
            ) : !projects || projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No projects found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.title}
                    <div className="text-xs text-muted-foreground font-normal mt-1">
                      /{project.slug}
                    </div>
                  </TableCell>
                  <TableCell>{project.category || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={project.status === "published" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {project.featured && (
                      <Star weight="fill" className="text-amber-500 mx-auto size-4" />
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      render={<Link href={`/admin/projects/${project.id}/edit`} />}
                      nativeButton={false}
                    >
                      <PencilSimple weight="duotone" className="size-4" />
                    </Button>
                    <DeleteProjectButton id={project.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

