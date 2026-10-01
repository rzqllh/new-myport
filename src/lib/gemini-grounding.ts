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

function clean(value: string | null | undefined) {
  return value?.trim() || "";
}

export const getCachedGroundingData = unstable_cache(
  async () => {
    const [about, experiences, capabilities, work] = await Promise.all([
      getPublicAbout("en"),
      getPublicExperiences("en"),
      getPublicCapabilities("en"),
      getPublicWork("en"),
    ]);

    const sections: string[] = [];
    const profile = [clean(about.bio), clean(about.philosophy)].filter(Boolean);

    if (profile.length) {
      sections.push(
        ["PROFILE [source:/about]", ...profile.map((item) => "- " + item)].join("\n")
      );
    }

    if (experiences.length) {
      sections.push(
        [
          "EXPERIENCE [source:/about]",
          ...experiences.map((item) => {
            const period =
              item.startDate +
              " to " +
              (item.isCurrent ? "Present" : item.endDate || "unspecified");
            const description = clean(item.description);
            return (
              "- " +
              item.role +
              " at " +
              item.company +
              " (" +
              period +
              ")" +
              (description ? ": " + description : "")
            );
          }),
        ].join("\n")
      );
    }

    if (work.length) {
      sections.push(
        [
          "WORK",
          ...work.map((item) => {
            const source = "/work/" + item.slug;
            const summary = clean(item.summary);
            const role = clean(item.role);
            const technologies = item.technologies.length
              ? " Tools/technology: " + item.technologies.join(", ") + "."
              : "";
            return (
              "- " +
              item.title +
              " [source:" +
              source +
              "]" +
              (role ? " — " + role : "") +
              (summary ? ": " + summary : "") +
              technologies
            );
          }),
        ].join("\n")
      );
    }

    if (capabilities.length) {
      sections.push(
        [
          "CAPABILITIES [source:/about]",
          ...capabilities.map(
            (item) =>
              "- " +
              item.name +
              " (" +
              item.category +
              ", " +
              item.level +
              ")" +
              (item.description ? ": " + item.description : "")
          ),
        ].join("\n")
      );
    }

    if (!sections.length) {
      return "No verified public portfolio content is currently available.";
    }

    return sections.join("\n\n");
  },
  ["portfolio-grounding"],
  {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [PUBLIC_CONTENT_CACHE_TAG],
  }
);
