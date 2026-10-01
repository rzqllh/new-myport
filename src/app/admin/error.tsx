"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="mx-auto max-w-2xl py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Admin workspace error
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold">
        This admin view could not be loaded.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Retry the current view first. Unsaved browser state is not treated as successfully persisted until the save action confirms it.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Retry view
        </Button>
        <Button
          variant="outline"
          render={<a href="/admin" />}
          nativeButton={false}
        >
          Admin home
        </Button>
      </div>
    </div>
  );
}
