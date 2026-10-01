"use client";

export function ResumePrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-8 items-center rounded-lg bg-foreground px-3 text-sm font-medium text-background hover:opacity-90"
    >
      {label}
    </button>
  );
}
