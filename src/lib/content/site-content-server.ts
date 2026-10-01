import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  PUBLIC_CONTENT_CACHE_TAG,
  PUBLIC_CONTENT_REVALIDATE_SECONDS,
} from "@/lib/content/public-cache";
import type { Locale } from "@/types/content";
import {
  mergeSiteCopy,
  SITE_COPY_DEFAULTS,
  type SiteCopyBundle,
} from "@/lib/content/site-copy";

const getSiteCopyCached = unstable_cache(
  async (locale: Locale): Promise<SiteCopyBundle> => {
    const supabase = createPublicClient();
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
  },
  ["site-copy"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CONTENT_CACHE_TAG],
  }
);

export async function getSiteCopy(locale: Locale): Promise<SiteCopyBundle> {
  return getSiteCopyCached(locale);
}
