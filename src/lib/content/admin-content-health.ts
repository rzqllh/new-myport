import { createClient } from "@/lib/supabase/server";
import { isV2SchemaUnavailable } from "@/lib/content/schema-compat";

export type ContentHealthSeverity = "blocking" | "review" | "info";

export interface ContentHealthIssue {
  id: string;
  severity: ContentHealthSeverity;
  label: string;
  detail: string;
  href: string;
}

export interface AdminContentHealth {
  schemaV2Available: boolean;
  issues: ContentHealthIssue[];
}

const quantifiedClaimPattern =
  /\b\d+(?:[.,]\d+)?\s*(?:%|x\b|users?\b|devices?\b|sites?\b|items?\b|assets?\b|records?\b|requests?\b|hours?\b|days?\b|weeks?\b|months?\b|years?\b|projects?\b|teams?\b|people\b|pax\b)/i;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function hasQuantifiedClaim(values: unknown[]) {
  return quantifiedClaimPattern.test(values.map(text).filter(Boolean).join(" "));
}

function isHttpUrl(value: unknown) {
  const candidate = text(value);
  if (!candidate) return false;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function sortIssues(issues: ContentHealthIssue[]) {
  const rank: Record<ContentHealthSeverity, number> = {
    blocking: 0,
    review: 1,
    info: 2,
  };

  return issues.sort(
    (a, b) =>
      rank[a.severity] - rank[b.severity] || a.label.localeCompare(b.label)
  );
}

export async function getAdminContentHealth(): Promise<AdminContentHealth> {
  const supabase = await createClient();

  const workItemsResult = await supabase
    .from("work_items")
    .select("id, slug, status")
    .eq("status", "published");

  if (workItemsResult.error) {
    if (isV2SchemaUnavailable(workItemsResult.error)) {
      return {
        schemaV2Available: false,
        issues: [
          {
            id: "schema-v2-unavailable",
            severity: "info",
            label: "Content health checks are limited until schema v2 is active.",
            detail:
              "Legacy content remains editable, but bilingual readiness and evidence checks require the tracked v2 migration.",
            href: "/admin",
          },
        ],
      };
    }

    return {
      schemaV2Available: true,
      issues: [
        {
          id: "content-health-unavailable",
          severity: "info",
          label: "Content health checks could not be completed.",
          detail:
            "The dashboard remains available. Retry after the data service is healthy.",
          href: "/admin",
        },
      ],
    };
  }

  const [
    workTranslationsResult,
    evidenceResult,
    insightsResult,
    insightTranslationsResult,
    mediaResult,
    mediaTranslationsResult,
    capabilitiesResult,
    capabilityTranslationsResult,
    redirectsResult,
  ] = await Promise.all([
    supabase
      .from("work_translations")
      .select(
        "work_id, locale, status, title, summary, context, challenge, approach, outcome, lessons, seo_description"
      ),
    supabase
      .from("work_evidence")
      .select("id, work_id, is_public, evidence_type, media_id, source_url")
      .eq("is_public", true),
    supabase
      .from("insights")
      .select("id, slug, status")
      .eq("status", "published"),
    supabase
      .from("insight_translations")
      .select("insight_id, locale, status, title, excerpt, seo_description"),
    supabase
      .from("media_assets")
      .select("id, url")
      .eq("is_public", true),
    supabase
      .from("media_translations")
      .select("media_id, locale, alt_text"),
    supabase
      .from("capabilities")
      .select("id, key")
      .eq("is_visible", true),
    supabase
      .from("capability_translations")
      .select("capability_id, locale, name"),
    supabase
      .from("content_redirects")
      .select("content_type, locale, old_slug, new_slug"),
  ]);

  const queryFailed = [
    workTranslationsResult.error,
    evidenceResult.error,
    insightsResult.error,
    insightTranslationsResult.error,
    mediaResult.error,
    mediaTranslationsResult.error,
    capabilitiesResult.error,
    capabilityTranslationsResult.error,
    redirectsResult.error,
  ].some(Boolean);

  if (queryFailed) {
    return {
      schemaV2Available: true,
      issues: [
        {
          id: "content-health-partial",
          severity: "info",
          label: "Some content health checks are temporarily unavailable.",
          detail:
            "No publish-quality conclusion is inferred from incomplete data.",
          href: "/admin",
        },
      ],
    };
  }

  const issues: ContentHealthIssue[] = [];
  const workTranslations = workTranslationsResult.data ?? [];
  const evidence = evidenceResult.data ?? [];
  const insights = insightsResult.data ?? [];
  const insightTranslations = insightTranslationsResult.data ?? [];
  const media = mediaResult.data ?? [];
  const mediaTranslations = mediaTranslationsResult.data ?? [];
  const capabilities = capabilitiesResult.data ?? [];
  const capabilityTranslations = capabilityTranslationsResult.data ?? [];
  const redirects = redirectsResult.data ?? [];

  for (const work of workItemsResult.data ?? []) {
    const translations = workTranslations.filter(
      (copy) => copy.work_id === work.id && copy.status === "published"
    );
    const en = translations.find((copy) => copy.locale === "en");
    const id = translations.find((copy) => copy.locale === "id");
    const title = en?.title || work.slug;
    const href = "/admin/projects/" + work.id + "/edit";

    if (!en) {
      issues.push({
        id: "work-en-" + work.id,
        severity: "blocking",
        label: title + " has no published English content.",
        detail:
          "English is the default locale, so this published Work item cannot render its canonical editorial content.",
        href,
      });
      continue;
    }

    if (!text(en.summary)) {
      issues.push({
        id: "work-summary-" + work.id,
        severity: "review",
        label: title + " is missing a summary.",
        detail:
          "The Work index and detail opening need a concise factual summary.",
        href,
      });
    }

    if (!text(en.seo_description)) {
      issues.push({
        id: "work-seo-en-" + work.id,
        severity: "review",
        label: title + " is missing an English SEO description.",
        detail: "Add localized SEO copy before the next public update.",
        href,
      });
    }

    if (!id) {
      issues.push({
        id: "work-id-" + work.id,
        severity: "review",
        label: title + " has no published Indonesian translation.",
        detail:
          "The Indonesian route stays unavailable until its translation is intentionally published.",
        href,
      });
    } else if (!text(id.seo_description)) {
      issues.push({
        id: "work-seo-id-" + work.id,
        severity: "review",
        label: title + " is missing an Indonesian SEO description.",
        detail: "The Indonesian page is published but its SEO copy is incomplete.",
        href,
      });
    }

    const quantified = hasQuantifiedClaim([
      en.summary,
      en.context,
      en.challenge,
      en.approach,
      en.outcome,
      en.lessons,
    ]);
    const evidenceCount = evidence.filter(
      (item) => item.work_id === work.id
    ).length;

    if (quantified && evidenceCount === 0) {
      issues.push({
        id: "work-evidence-" + work.id,
        severity: "review",
        label: title + " contains a quantified claim without published evidence.",
        detail:
          "Add a source/evidence record or rewrite the claim qualitatively.",
        href,
      });
    }
  }

  for (const insight of insights) {
    const translations = insightTranslations.filter(
      (copy) =>
        copy.insight_id === insight.id && copy.status === "published"
    );
    const en = translations.find((copy) => copy.locale === "en");
    const id = translations.find((copy) => copy.locale === "id");
    const title = en?.title || insight.slug;
    const href = "/admin/blog/" + insight.id + "/edit";

    if (!en) {
      issues.push({
        id: "insight-en-" + insight.id,
        severity: "blocking",
        label: title + " has no published English content.",
        detail:
          "English is the default locale, so this published Insight cannot render its canonical article.",
        href,
      });
      continue;
    }

    if (!text(en.seo_description)) {
      issues.push({
        id: "insight-seo-en-" + insight.id,
        severity: "review",
        label: title + " is missing an English SEO description.",
        detail: "Add localized SEO copy before the next public update.",
        href,
      });
    }

    if (!id) {
      issues.push({
        id: "insight-id-" + insight.id,
        severity: "review",
        label: title + " has no published Indonesian translation.",
        detail:
          "The Indonesian route stays unavailable until its translation is intentionally published.",
        href,
      });
    } else if (!text(id.seo_description)) {
      issues.push({
        id: "insight-seo-id-" + insight.id,
        severity: "review",
        label: title + " is missing an Indonesian SEO description.",
        detail: "The Indonesian article is published but its SEO copy is incomplete.",
        href,
      });
    }
  }

  for (const item of evidence) {
    if (!item.media_id && !text(item.source_url)) {
      issues.push({
        id: "evidence-source-" + item.id,
        severity: "review",
        label: "Published evidence is missing a source or media artifact.",
        detail:
          "Evidence should point to a public-safe source URL or a managed media asset.",
        href: "/admin/projects/" + item.work_id + "/edit",
      });
    } else if (text(item.source_url) && !isHttpUrl(item.source_url)) {
      issues.push({
        id: "evidence-url-" + item.id,
        severity: "review",
        label: "Published evidence has an invalid source URL.",
        detail:
          "Evidence source URLs must use an explicit http or https URL. Availability is not inferred without a live check.",
        href: "/admin/projects/" + item.work_id + "/edit",
      });
    }
  }

  for (const asset of media) {
    if (!isHttpUrl(asset.url)) {
      issues.push({
        id: "media-url-" + asset.id,
        severity: "blocking",
        label: "Public media has an invalid asset URL.",
        detail:
          "Public media must resolve from an explicit http or https URL before it can be relied on by visitors.",
        href: "/admin/projects",
      });
    }
  }

  const redirectMap = new Map(
    redirects.map((redirect) => [
      [redirect.content_type, redirect.locale, redirect.old_slug].join(":"),
      redirect.new_slug,
    ])
  );

  for (const redirect of redirects) {
    if (redirect.old_slug === redirect.new_slug) {
      issues.push({
        id:
          "redirect-self-" +
          [redirect.content_type, redirect.locale, redirect.old_slug].join("-"),
        severity: "blocking",
        label: "Redirect history contains a self-redirect.",
        detail: "A canonical URL cannot redirect to the same slug.",
        href: "/admin",
      });
      continue;
    }

    const start = redirect.old_slug;
    let current = redirect.new_slug;
    const seen = new Set([start]);

    for (let depth = 0; depth < 20; depth += 1) {
      if (seen.has(current)) {
        issues.push({
          id:
            "redirect-cycle-" +
            [redirect.content_type, redirect.locale, redirect.old_slug].join("-"),
          severity: "blocking",
          label: "Redirect history contains a cycle.",
          detail:
            "Resolve the redirect chain before publishing another permalink change.",
          href: "/admin",
        });
        break;
      }

      seen.add(current);
      const next = redirectMap.get(
        [redirect.content_type, redirect.locale, current].join(":")
      );
      if (!next) break;
      current = next;
    }
  }

  const mediaMissingEnglishAlt = media.filter((asset) => {
    const alt = mediaTranslations.find(
      (copy) => copy.media_id === asset.id && copy.locale === "en"
    );
    return !text(alt?.alt_text);
  }).length;

  if (mediaMissingEnglishAlt) {
    issues.push({
      id: "media-alt-en",
      severity: "blocking",
      label:
        String(mediaMissingEnglishAlt) +
        " public media item" +
        (mediaMissingEnglishAlt === 1 ? "" : "s") +
        " missing English alt text.",
      detail:
        "Public media needs meaningful alternative text for the default locale.",
      href: "/admin/projects",
    });
  }

  const mediaMissingIndonesianAlt = media.filter((asset) => {
    const alt = mediaTranslations.find(
      (copy) => copy.media_id === asset.id && copy.locale === "id"
    );
    return !text(alt?.alt_text);
  }).length;

  if (mediaMissingIndonesianAlt) {
    issues.push({
      id: "media-alt-id",
      severity: "review",
      label:
        String(mediaMissingIndonesianAlt) +
        " public media item" +
        (mediaMissingIndonesianAlt === 1 ? "" : "s") +
        " missing Indonesian alt text.",
      detail:
        "Review localized media copy for Indonesian pages that use these assets.",
      href: "/admin/projects",
    });
  }

  const capabilitiesMissingId = capabilities.filter((capability) => {
    return !capabilityTranslations.some(
      (copy) =>
        copy.capability_id === capability.id &&
        copy.locale === "id" &&
        Boolean(text(copy.name))
    );
  }).length;

  if (capabilitiesMissingId) {
    issues.push({
      id: "capabilities-id",
      severity: "review",
      label:
        String(capabilitiesMissingId) +
        " public capabilit" +
        (capabilitiesMissingId === 1 ? "y is" : "ies are") +
        " missing Indonesian copy.",
      detail:
        "Capabilities on Indonesian profile surfaces should be intentionally authored, not machine-filled.",
      href: "/admin/skills",
    });
  }

  return {
    schemaV2Available: true,
    issues: sortIssues(issues),
  };
}
