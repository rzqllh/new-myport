import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/content";
import {
  mergeSiteCopy,
  SITE_COPY_DEFAULTS,
  type SiteCopyBundle,
} from "@/lib/content/site-copy";

export const getSiteCopy = cache(
  async (locale: Locale): Promise<SiteCopyBundle> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("namespace, content")
      .eq("locale", locale)
      .eq("status", "published");

    if (error || !data) {
      return structuredClone(SITE_COPY_DEFAULTS[locale]);
    }

    return mergeSiteCopy(
      locale,
      data.map((row) => ({
        namespace: row.namespace,
        content: (row.content ?? {}) as Record<string, unknown>,
      }))
    );
  }
);
