import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { FileText, GithubLogo, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import { CaseArtifact } from "@/components/case-file/case-artifact";
import { getProjectCase } from "@/lib/portfolio-data";

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectCase(slug, "en");
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("portfolio_locale")?.value === "id" ? "id" : "en";
  const project = await getProjectCase(slug, locale);
  if (!project) notFound();

  const labels = locale === "id" ? { back: "Kembali ke indeks", context: "Konteks", decision: "Keputusan", artifact: "Artefak", outcome: "Hasil", role: "Peran", stack: "Stack", pending: "Menunggu unggahan", redacted: "Dokumen telah disensor untuk publik" } : { back: "Back to index", context: "Context", decision: "Decision", artifact: "Artifact", outcome: "Outcome", role: "Role", stack: "Stack", pending: "Pending upload", redacted: "Document redacted for public use" };

  return (
    <article className="mx-auto max-w-[1400px] px-6 pb-24 pt-14 md:pb-32 md:pt-20">
      <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary">{labels.back}</Link>

      <header className="mt-10 grid gap-10 border-b border-foreground pb-14 lg:grid-cols-12">
        <div className="lg:col-span-8"><p className="text-sm font-semibold text-primary">{project.category}</p><h1 className="mt-5 text-6xl font-medium tracking-[-0.055em] md:text-8xl">{project.title}</h1><p className="mt-7 max-w-[60ch] text-lg leading-8 text-muted-foreground">{project.description}</p></div>
        <dl className="grid content-end gap-6 border-t border-border pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div><dt className="text-xs font-semibold text-muted-foreground">{labels.role}</dt><dd className="mt-2 text-sm">{project.role}</dd></div>
          <div><dt className="text-xs font-semibold text-muted-foreground">{labels.stack}</dt><dd className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">{project.tech_stack.map((tech) => <span key={tech}>{tech}</span>)}</dd></div>
        </dl>
      </header>

      <div className="grid gap-12 border-b border-border py-14 lg:grid-cols-12">
        <section className="lg:col-span-5"><p className="text-sm font-semibold text-muted-foreground">01 / {labels.context}</p><p className="mt-5 text-2xl leading-10 tracking-[-0.02em]">{project.context}</p></section>
        <section className="border-l-2 border-primary pl-6 lg:col-span-7 lg:pl-10"><p className="text-sm font-semibold text-primary">02 / {labels.decision}</p><p className="mt-5 max-w-[62ch] text-2xl leading-10 tracking-[-0.02em]">{project.decision}</p></section>
      </div>

      <section className="grid gap-10 border-b border-border py-14 lg:grid-cols-12">
        <div className="lg:col-span-4"><p className="text-sm font-semibold text-muted-foreground">03 / {labels.artifact}</p><p className="mt-5 text-sm leading-7 text-muted-foreground">The evidence below links to the actual implementation or a deliberately redacted public excerpt.</p></div>
        <div className="lg:col-span-8"><CaseArtifact slug={project.slug} /><div className="mt-6 divide-y divide-border border-y border-border">{project.evidence_items.map((item) => { const Icon = item.kind === "repository" ? GithubLogo : item.kind === "screenshot" ? ImageIcon : FileText; return <div key={item.label} className="grid gap-3 py-5 sm:grid-cols-[auto_1fr_auto]"><Icon weight="duotone" className="size-5 text-primary" /><div><p className="text-sm font-semibold">{item.label}</p>{item.caption && <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.caption}</p>}{item.redacted && <p className="mt-2 text-xs text-primary">{labels.redacted}</p>}</div>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-semibold hover:text-primary">Open</a> : <span className="text-xs text-muted-foreground">{labels.pending}</span>}</div>; })}</div></div>
      </section>

      <section className="grid gap-8 py-14 lg:grid-cols-12"><p className="text-sm font-semibold text-muted-foreground lg:col-span-4">04 / {labels.outcome}</p><p className="max-w-[68ch] text-3xl leading-[1.35] tracking-[-0.03em] lg:col-span-8">{project.outcome}</p></section>
    </article>
  );
}
