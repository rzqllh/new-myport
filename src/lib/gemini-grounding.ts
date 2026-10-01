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

export type GroundingSourceKind =
  | "profile"
  | "experience"
  | "capability"
  | "work";

export interface GroundingSource {
  id: string;
  kind: GroundingSourceKind;
  title: string;
  path: string;
  content: string;
}

function clean(value: string | null | undefined) {
  return value?.trim() || "";
}

function normalizedTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
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

export function selectGroundingSources(
  corpus: GroundingSource[],
  question: string,
  limit = 6
) {
  if (!corpus.length) return [];

  const tokens = normalizedTokens(question);
  if (!tokens.length) {
    return corpus
      .filter((source) => source.kind === "profile" || source.kind === "experience")
      .slice(0, limit);
  }

  const scored = corpus
    .map((source, index) => {
      const title = source.title.toLowerCase();
      const content = source.content.toLowerCase();
      const path = source.path.toLowerCase();

      const score = tokens.reduce((total, token) => {
        const titleScore = title.includes(token) ? 5 : 0;
        const contentScore = content.includes(token) ? 2 : 0;
        const pathScore = path.includes(token) ? 1 : 0;
        return total + titleScore + contentScore + pathScore;
      }, 0);

      return { source, score, index };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.source);

  if (scored.length) return scored;

  return corpus
    .filter((source) => source.kind === "profile" || source.kind === "experience")
    .slice(0, Math.min(limit, 3));
}

export function formatGroundingSources(sources: GroundingSource[]) {
  if (!sources.length) {
    return "No verified public portfolio content matched this question.";
  }

  return sources
    .map(
      (source, index) =>
        [
          "SOURCE " + String(index + 1),
          "title: " + source.title,
          "path: " + source.path,
          "kind: " + source.kind,
          "content:",
          source.content,
        ].join("\n")
    )
    .join("\n\n");
}
