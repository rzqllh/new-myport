"use client";

import { Plus, Trash } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EvidenceItem } from "@/types";

export function EvidenceEditor({ value, onChange }: { value: EvidenceItem[]; onChange: (items: EvidenceItem[]) => void }) {
  function update(index: number, patch: Partial<EvidenceItem>) {
    onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  function add() {
    onChange([...value, { kind: "repository", label: "", url: "", caption: "", redacted: false, status: "available" }]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Evidence items</p><p className="text-xs text-muted-foreground">Only store public links or documents that have already been redacted.</p></div><button type="button" onClick={add} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"><Plus weight="bold" /> Add evidence</button></div>
      {value.map((item, index) => (
        <div key={index} className="grid gap-3 border border-border bg-muted/20 p-4 md:grid-cols-2">
          <div className="space-y-1"><Label className="text-xs">Type</Label><select value={item.kind} onChange={(event) => update(index, { kind: event.target.value as EvidenceItem["kind"] })} className="h-9 w-full border border-input bg-background px-3 text-sm"><option value="repository">Repository</option><option value="screenshot">Screenshot</option><option value="redacted_excerpt">Redacted excerpt</option><option value="document">Document</option></select></div>
          <div className="space-y-1"><Label className="text-xs">Status</Label><select value={item.status || "available"} onChange={(event) => update(index, { status: event.target.value as EvidenceItem["status"] })} className="h-9 w-full border border-input bg-background px-3 text-sm"><option value="available">Available</option><option value="pending">Pending upload</option></select></div>
          <div className="space-y-1"><Label className="text-xs">Label</Label><Input value={item.label} onChange={(event) => update(index, { label: event.target.value })} /></div>
          <div className="space-y-1"><Label className="text-xs">Label (Indonesian)</Label><Input value={item.label_id || ""} onChange={(event) => update(index, { label_id: event.target.value })} /></div>
          <div className="space-y-1 md:col-span-2"><Label className="text-xs">Public URL</Label><Input value={item.url || ""} onChange={(event) => update(index, { url: event.target.value })} placeholder="Leave empty while pending" /></div>
          <div className="space-y-1"><Label className="text-xs">Caption</Label><Textarea value={item.caption || ""} onChange={(event) => update(index, { caption: event.target.value })} className="min-h-20" /></div>
          <div className="space-y-1"><Label className="text-xs">Caption (Indonesian)</Label><Textarea value={item.caption_id || ""} onChange={(event) => update(index, { caption_id: event.target.value })} className="min-h-20" /></div>
          <div className="flex items-center justify-between md:col-span-2"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={item.redacted || false} onChange={(event) => update(index, { redacted: event.target.checked })} /> Source has been redacted for public use</label><button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive"><Trash weight="duotone" /> Remove</button></div>
        </div>
      ))}
    </div>
  );
}
