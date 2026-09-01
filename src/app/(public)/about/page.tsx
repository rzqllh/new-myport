import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getExperienceCases } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Experience", description: "Work case files for Hafizh Rizqullah Prasetya." };

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("portfolio_locale")?.value === "id" ? "id" : "en";
  const experiences = await getExperienceCases(locale);
  const copy = locale === "id" ? {
    label: "Profil kerja",
    title: "PMO sebagai identitas utama. Kemampuan membangun sistem sebagai pembuktinya.",
    intro: "Saya bekerja di antara orang, progres, dan sistem. Case file berikut menunjukkan bagaimana pekerjaan tersebut dijalankan dalam konteks nyata.",
    context: "Konteks", decision: "Keputusan", artifact: "Artefak", outcome: "Hasil", pending: "Menunggu excerpt tersensor",
  } : {
    label: "Working profile",
    title: "PMO is the anchor. Building systems is the proof behind it.",
    intro: "I work between people, progress, and systems. The case files below document how that work operates in real settings.",
    context: "Context", decision: "Decision", artifact: "Artifact", outcome: "Outcome", pending: "Redacted excerpt pending",
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-20 md:py-28">
      <header className="grid gap-8 border-b border-foreground pb-16 lg:grid-cols-12">
        <div className="lg:col-span-8"><p className="text-sm font-semibold text-primary">{copy.label}</p><h1 className="mt-5 max-w-[980px] text-5xl font-medium tracking-[-0.05em] md:text-7xl">{copy.title}</h1></div>
        <p className="max-w-[48ch] self-end text-base leading-7 text-muted-foreground lg:col-span-4">{copy.intro}</p>
      </header>

      {experiences.map((experience, index) => (
        <article key={experience.id} className="border-b border-border py-14 md:py-20">
          <header className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3"><p className="text-xs font-semibold text-muted-foreground">WORK CASE {String(index + 1).padStart(2, "0")}</p><p className="mt-5 text-sm text-muted-foreground">{experience.start_date.slice(0,4)}—{experience.is_current ? "Present" : experience.end_date?.slice(0,4)}</p></div>
            <div className="lg:col-span-9"><h2 className="text-4xl font-semibold tracking-[-0.04em]">{experience.company}</h2><p className="mt-3 text-lg text-muted-foreground">{experience.role}</p></div>
          </header>
          <dl className="mt-12 grid gap-8 lg:grid-cols-4">
            <div className="border-l border-border pl-5"><dt className="text-xs font-semibold text-muted-foreground">{copy.context}</dt><dd className="mt-4 text-sm leading-7">{experience.context}</dd></div>
            <div className="border-l-2 border-primary pl-5"><dt className="text-xs font-semibold text-primary">{copy.decision}</dt><dd className="mt-4 text-sm leading-7">{experience.decision}</dd></div>
            <div className="border-l border-border pl-5"><dt className="text-xs font-semibold text-muted-foreground">{copy.artifact}</dt><dd className="mt-4 space-y-3 text-sm leading-6">{experience.evidence_items.map((item) => <div key={item.label}><p className="font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.status === "pending" ? copy.pending : item.caption}</p></div>)}</dd></div>
            <div className="border-l border-border pl-5"><dt className="text-xs font-semibold text-muted-foreground">{copy.outcome}</dt><dd className="mt-4 text-sm leading-7">{experience.outcome}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  );
}
