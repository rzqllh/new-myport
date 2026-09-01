import { Check, FileText, Warning } from "@phosphor-icons/react/dist/ssr";

export function CaseArtifact({ slug }: { slug: string }) {
  if (slug === "opspilot") {
    return (
      <div className="relative min-h-64 overflow-hidden border border-border bg-[#F1F5FD] p-5 md:min-h-80 md:p-8" aria-label="OpsPilot project-control model illustration">
        <div className="grid grid-cols-[0.72fr_1.28fr] gap-4">
          <div className="border border-[#C7D2EA] bg-white p-4">
            <div className="mb-5 h-2 w-16 bg-primary" />
            <div className="space-y-3">
              {["Delivery", "Dependencies", "Decisions", "Evidence"].map((item, index) => (
                <div key={item} className="flex items-center justify-between border-b border-border pb-2 text-[10px] font-medium text-slate-600">
                  <span>{item}</span><span className={index === 2 ? "text-primary" : "text-slate-400"}>0{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-8">
            <div className="grid grid-cols-[1fr_auto] gap-3 border border-[#C7D2EA] bg-white p-4">
              <div><p className="text-[10px] text-slate-400">OPEN DECISION</p><p className="mt-2 text-xs font-semibold text-slate-800">Dependency owner</p></div>
              <Warning weight="duotone" className="size-5 text-primary" />
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3 border-l-4 border-primary bg-white p-4 shadow-sm">
              <div><p className="text-[10px] text-primary">EVIDENCE ATTACHED</p><p className="mt-2 text-xs font-semibold text-slate-800">Decision record / 014</p></div>
              <Check weight="bold" className="size-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slug === "rangkai") {
    return (
      <div className="relative min-h-64 overflow-hidden border border-border bg-[#F4F6FA] p-5 md:min-h-80 md:p-8" aria-label="Rangkai decision-provenance illustration">
        <div className="absolute bottom-0 left-1/2 top-0 w-px bg-[#B9C7E5]" />
        <div className="relative grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-semibold text-slate-500">INPUT / UNRESOLVED</p>
            <div className="border border-[#C7D2EA] bg-white p-4 text-xs leading-relaxed text-slate-700">Who owns the deployment boundary?</div>
            <div className="ml-5 border border-dashed border-[#9CAED5] bg-transparent p-4 text-xs text-slate-500">Assumption stays visible</div>
          </div>
          <div className="space-y-4 pt-12">
            <p className="text-[10px] font-semibold text-primary">OUTPUT / CONFIRMED</p>
            <div className="border-l-4 border-primary bg-white p-4 shadow-sm">
              <p className="text-[10px] text-primary">BUILD PACK</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Runtime boundary</p>
              <div className="mt-4 space-y-2"><span className="block h-1.5 w-full bg-slate-200" /><span className="block h-1.5 w-4/5 bg-slate-200" /><span className="block h-1.5 w-2/3 bg-primary/40" /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-64 overflow-hidden border border-border bg-[#F1F5FD] p-5 md:min-h-80 md:p-8" aria-label="SummAI meeting-output illustration">
      <div className="grid h-full grid-cols-[0.86fr_1.14fr] gap-4">
        <div className="border border-[#C7D2EA] bg-white p-4">
          <div className="mb-5 flex items-center gap-2 text-[10px] text-slate-500"><FileText weight="duotone" className="size-4 text-primary" /> TRANSCRIPT</div>
          <div className="space-y-3">{[92, 68, 85, 48, 76, 61].map((width, index) => <span key={index} className="block h-1.5 bg-slate-200" style={{ width: `${width}%` }} />)}</div>
        </div>
        <div className="space-y-3 pt-7">
          <div className="border-l-4 border-primary bg-white p-4 shadow-sm"><p className="text-[10px] text-primary">DECISION</p><p className="mt-2 text-xs font-semibold text-slate-800">Migration window confirmed</p></div>
          <div className="border border-[#C7D2EA] bg-white p-4"><p className="text-[10px] text-slate-400">ACTION / OWNER</p><p className="mt-2 text-xs font-semibold text-slate-800">Validate readiness · PMO</p></div>
        </div>
      </div>
    </div>
  );
}
