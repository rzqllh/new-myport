import { unstable_cache } from "next/cache";
import {
  getPublicAbout,
  getPublicCapabilities,
  getPublicExperiences,
  getPublicWork,
} from "@/lib/content/public-content";
import {
  PUBLIC_CONTENT_CACHE_TAG,
  PUBLIC_CONTENT_REVALIDATE_SECONDS,
} from "@/lib/content/public-cache";

import {
  formatGroundingSources,
  selectGroundingSources,
  type GroundingSource,
} from "@/lib/grounding-ranker";

function clean(value: string | null | undefined) {
  return value?.trim() || "";
}

export const getCachedGroundingCorpus = unstable_cache(
  async (): Promise<GroundingSource[]> => {
    const [about, experiences, capabilities, work] = await Promise.all([
      getPublicAbout("en"),
      getPublicExperiences("en"),
      getPublicCapabilities("en"),
      getPublicWork("en"),
    ]);

    const sources: GroundingSource[] = [];
    const profile = [clean(about.bio), clean(about.philosophy)]
      .filter(Boolean)
      .join("\n");

    if (profile) {
      sources.push({
        id: "profile",
        kind: "profile",
        title: "Professional profile",
        path: "/about",
        content: profile,
      });
    }

    for (const item of experiences) {
      const period =
        item.startDate +
        " to " +
        (item.isCurrent ? "Present" : item.endDate || "unspecified");
      const description = clean(item.description);

      sources.push({
        id: "experience-" + item.id,
        kind: "experience",
        title: item.role + " at " + item.company,
        path: "/about",
        content:
          item.role +
          " at " +
          item.company +
          " (" +
          period +
          ")" +
          (description ? ": " + description : ""),
      });
    }

    for (const item of work) {
      const fields = [
        clean(item.summary),
        clean(item.role),
        item.technologies.join(", "),
        clean(item.context),
        clean(item.challenge),
        clean(item.approach),
        clean(item.outcome),
        clean(item.lessons),
      ].filter(Boolean);

      sources.push({
        id: "work-" + item.id,
        kind: "work",
        title: item.title,
        path: "/work/" + item.slug,
        content: fields.join("\n"),
      });
    }

    for (const item of capabilities) {
      sources.push({
        id: "capability-" + item.id,
        kind: "capability",
        title: item.name,
        path: "/about",
        content:
          item.name +
          " (" +
          item.category +
          ", " +
          item.level +
          ")" +
          (item.description ? ": " + item.description : ""),
      });
    }

    return sources;
  },
  ["portfolio-grounding-corpus"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CONTENT_CACHE_TAG],
  }
);


export { formatGroundingSources, selectGroundingSources };
