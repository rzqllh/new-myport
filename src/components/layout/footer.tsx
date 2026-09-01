import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-10 text-sm md:grid-cols-3">
        <div><p className="font-display font-semibold">Hafizh Rizqullah Prasetya</p><p className="mt-2 text-muted-foreground">Project Management Officer · IT & Strategy</p></div>
        <div className="flex flex-col gap-2 text-muted-foreground"><a href="mailto:hrizqullah484@gmail.com" className="hover:text-foreground">hrizqullah484@gmail.com</a><span>Depok, Indonesia</span></div>
        <div className="flex gap-5 md:justify-end"><a href="https://github.com/rzqllh" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a><a href="https://linkedin.com/in/rzqllh" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a><Link href="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link></div>
      </div>
    </footer>
  );
}
