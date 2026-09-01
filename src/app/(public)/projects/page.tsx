import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getAllProjects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case files",
  description: "Project case files documenting context, decisions, artifacts, and outcomes.",
};

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("portfolio_locale")?.value === "id" ? "id" : "en";
  const projects = await getAllProjects(locale);
  const copy = locale === "id" ? {
    label: "Indeks pekerjaan",
    title: "Case file produk",
    intro: "Bukan galeri screenshot. Setiap entri menjelaskan masalah yang dihadapi, keputusan yang diambil, bukti yang tersedia, dan hasil yang dapat dipertanggungjawabkan.",
    context: "Konteks",
    decision: "Keputusan",
    read: "Buka case file",
  } : {
    label: "Work index",
    title: "Product case files",
    intro: "Not a screenshot gallery. Each entry documents the problem, the decision made, the evidence available, and the outcome that can be supported.",
    context: "Context",
    decision: "Decision",
    read: "Open case file",
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-20 md:py-28">
      <header className="grid gap-8 border-b border-foreground pb-14 lg:grid-cols-12">
        <div className="lg:col-span-7"><p className="text-sm font-semibold text-primary">{copy.label}</p><h1 className="mt-5 text-5xl font-medium tracking-[-0.05em] md:text-7xl">{copy.title}</h1></div>
        <p className="max-w-[52ch] self-end text-base leading-7 text-muted-foreground lg:col-span-5">{copy.intro}</p>
      </header>

      <div>
        {projects.map((project, index) => (
          <article key={project.id} className="grid gap-8 border-b border-border py-10 lg:grid-cols-12 lg:py-14">
            <div className="lg:col-span-3"><p className="text-xs font-semibold text-muted-foreground">CASE {String(index + 1).padStart(2, "0")}</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">{project.title}</h2><p className="mt-2 text-sm text-muted-foreground">{project.category}</p></div>
            <div className="lg:col-span-4"><p className="text-xs font-semibold text-muted-foreground">{copy.context}</p><p className="mt-3 text-sm leading-7 text-foreground/80">{project.context}</p></div>
            <div className="border-l-2 border-primary pl-5 lg:col-span-4"><p className="text-xs font-semibold text-primary">{copy.decision}</p><p className="mt-3 text-sm leading-7 text-foreground/80">{project.decision}</p></div>
            <div className="flex items-end lg:col-span-1 lg:justify-end"><Link href={`/projects/${project.slug}`} className="border-b border-foreground pb-1 text-sm font-semibold hover:border-primary hover:text-primary">{copy.read}</Link></div>
          </article>
        ))}
      </div>
    </div>
  );
}
