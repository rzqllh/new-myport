"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type ResourceType =
  | "work_translation"
  | "insight_translation"
  | "site_content";

interface RevisionRow {
  id: string;
  created_at: string;
}

export function RevisionHistory({
  resourceType,
  resourceId,
  locale,
}: {
  resourceType: ResourceType;
  resourceId: string;
  locale: "en" | "id";
}) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<RevisionRow[]>([]);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let active = true;

    supabase
      .from("content_revisions")
      .select("id, created_at")
      .eq("resource_type", resourceType)
      .eq("resource_id", resourceId)
      .eq("locale", locale)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAvailable(false);
          return;
        }
        setAvailable(true);
        setRows((data ?? []) as RevisionRow[]);
      });

    return () => {
      active = false;
    };
  }, [locale, resourceId, resourceType, supabase]);

  async function restore(revisionId: string) {
    if (!window.confirm("Restore this editorial revision? The current version will remain in revision history.")) {
      return;
    }

    setRestoring(revisionId);
    try {
      const response = await fetch("/api/admin/revisions/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      });

      if (!response.ok) throw new Error("Restore failed");
      window.location.reload();
    } finally {
      setRestoring(null);
    }
  }

  if (!available || rows.length === 0) return null;

  return (
    <div className="space-y-3 border-t border-border pt-5">
      <div>
        <p className="text-sm font-medium">Revision history</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Editorial copy only. Permalinks and structural metadata are not restored here.
        </p>
      </div>
      <div className="space-y-2">
        {rows.map((revision, index) => (
          <div
            key={revision.id}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="text-muted-foreground">
              {index === 0 ? "Current snapshot" : new Date(revision.created_at).toLocaleString()}
            </span>
            {index > 0 ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={restoring !== null}
                onClick={() => restore(revision.id)}
              >
                {restoring === revision.id ? "Restoring…" : "Restore"}
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
