import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/content";

export interface PublicMedia {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  role: string;
  sortOrder: number;
}

export interface PublicEvidence {
  id: string;
  type: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  sourceDate: string | null;
  media: PublicMedia | null;
  sortOrder: number;
}

export interface PublicWork {
  source: "v2" | "legacy";
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  role: string | null;
  discipline: string;
  workType: string;
  timeframeStart: string | null;
  timeframeEnd: string | null;
  featured: boolean;
  sortOrder: number;
  liveUrl: string | null;
  repositoryUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  technologies: string[];
  cover: PublicMedia | null;
  media: PublicMedia[];
  context: string | null;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  lessons: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  evidence: PublicEvidence[];
}

export interface PublicInsight {
  source: "v2" | "legacy";
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyHtml: string | null;
  tags: string[];
  publishedAt: string | null;
  updatedAt: string | null;
  relatedWorkId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface PublicExperience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface PublicCapability {
  id: string;
  name: string;
  description: string | null;
  category: string;
  level: "primary" | "working" | "familiar";
  sortOrder: number;
}

export interface PublicAbout {
  bio: string | null;
  philosophy: string | null;
  hobbies: string | null;
  photoUrl: string | null;
}

export interface PublicSettings {
  general: Record<string, string>;
  social: Record<string, string>;
  cv: Record<string, string>;
  profile: Record<string, string>;
}

function legacyDiscipline(category: string | null) {
  if (category === "ui-ux") return "research-design";
  return "engineering";
}

function legacyWorkType(category: string | null) {
  if (category === "tools") return "tool";
  if (category === "ui-ux") return "research";
  return "product";
}

function mapMedia(
  link: {
    media_id: string;
    role: string;
    sort_order: number;
  },
  assets: Map<string, { url: string }>,
  translations: Map<string, { alt_text: string | null; caption: string | null }>
): PublicMedia | null {
  const asset = assets.get(link.media_id);
  if (!asset) return null;
  const copy = translations.get(link.media_id);

  return {
    id: link.media_id,
    url: asset.url,
    alt: copy?.alt_text ?? "",
    caption: copy?.caption ?? null,
    role: link.role,
    sortOrder: link.sort_order,
  };
}

async function getV2WorkCollection(locale: Locale) {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("work_items")
    .select(
      "id, slug, discipline, work_type, timeframe_start, timeframe_end, featured, sort_order, live_url, repository_url, published_at, updated_at"
    )
    .eq("status", "published")
    .eq("visibility", "public")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) return null;
  if (!items?.length) return [];

  const ids = items.map((item) => item.id);
  const [{ data: translations, error: translationError }, { data: mediaLinks }] =
    await Promise.all([
      supabase
        .from("work_translations")
        .select(
          "work_id, title, summary, role, context, challenge, approach, outcome, lessons, seo_title, seo_description"
        )
        .in("work_id", ids)
        .eq("locale", locale)
        .eq("status", "published"),
      supabase
        .from("work_media")
        .select("work_id, media_id, role, sort_order")
        .in("work_id", ids)
        .eq("role", "cover")
        .order("sort_order", { ascending: true }),
    ]);

  if (translationError) return null;

  const translationById = new Map(
    (translations ?? []).map((row) => [row.work_id, row])
  );

  const mediaIds = Array.from(
    new Set((mediaLinks ?? []).map((row) => row.media_id))
  );
  const assets = new Map<string, { url: string }>();
  const mediaTranslations = new Map<
    string,
    { alt_text: string | null; caption: string | null }
  >();

  if (mediaIds.length) {
    const [{ data: assetRows }, { data: mediaCopyRows }] = await Promise.all([
      supabase
        .from("media_assets")
        .select("id, url")
        .in("id", mediaIds)
        .eq("is_public", true),
      supabase
        .from("media_translations")
        .select("media_id, alt_text, caption")
        .in("media_id", mediaIds)
        .eq("locale", locale),
    ]);

    for (const asset of assetRows ?? []) {
      assets.set(asset.id, { url: asset.url });
    }
    for (const copy of mediaCopyRows ?? []) {
      mediaTranslations.set(copy.media_id, copy);
    }
  }

  const coverByWork = new Map<string, PublicMedia>();
  for (const link of mediaLinks ?? []) {
    if (coverByWork.has(link.work_id)) continue;
    const mapped = mapMedia(link, assets, mediaTranslations);
    if (mapped) coverByWork.set(link.work_id, mapped);
  }

  return items.flatMap((item): PublicWork[] => {
    const translation = translationById.get(item.id);
    if (!translation) return [];

    return [
      {
        source: "v2",
        id: item.id,
        slug: item.slug,
        title: translation.title,
        summary: translation.summary,
        role: translation.role,
        discipline: item.discipline,
        workType: item.work_type,
        timeframeStart: item.timeframe_start,
        timeframeEnd: item.timeframe_end,
        featured: item.featured,
        sortOrder: item.sort_order,
        liveUrl: item.live_url,
        repositoryUrl: item.repository_url,
        publishedAt: item.published_at,
        updatedAt: item.updated_at,
        technologies: [],
        cover: coverByWork.get(item.id) ?? null,
        media: [],
        context: translation.context,
        challenge: translation.challenge,
        approach: translation.approach,
        outcome: translation.outcome,
        lessons: translation.lessons,
        seoTitle: translation.seo_title,
        seoDescription: translation.seo_description,
        evidence: [],
      },
    ];
  });
}

async function getLegacyWorkCollection() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, description, role, category, tech_stack, featured, sort_order, demo_url, github_url, cover_url, created_at, updated_at"
    )
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map(
    (item): PublicWork => ({
      source: "legacy",
      id: item.id,
      slug: item.slug,
      title: item.title,
      summary: item.description,
      role: item.role,
      discipline: legacyDiscipline(item.category),
      workType: legacyWorkType(item.category),
      timeframeStart: null,
      timeframeEnd: null,
      featured: item.featured,
      sortOrder: item.sort_order,
      liveUrl: item.demo_url,
      repositoryUrl: item.github_url,
      publishedAt: item.created_at,
      updatedAt: item.updated_at,
      technologies: item.tech_stack ?? [],
      cover: item.cover_url
        ? {
            id: `legacy-cover-${item.id}`,
            url: item.cover_url,
            alt: "",
            caption: null,
            role: "cover",
            sortOrder: 0,
          }
        : null,
      media: [],
      context: null,
      challenge: null,
      approach: null,
      outcome: null,
      lessons: null,
      seoTitle: null,
      seoDescription: null,
      evidence: [],
    })
  );
}

export async function getPublicWork(locale: Locale = "en") {
  const v2 = await getV2WorkCollection(locale);
  if (v2 !== null) return v2;
  return locale === "en" ? getLegacyWorkCollection() : [];
}

export async function getPublicWorkDetail(
  slug: string,
  locale: Locale = "en"
): Promise<PublicWork | null> {
  const collection = await getPublicWork(locale);
  const base = collection.find((item) => item.slug === slug);
  if (!base) return null;

  const supabase = await createClient();

  if (base.source === "legacy") {
    const { data } = await supabase
      .from("project_images")
      .select("id, url, alt_text, sort_order")
      .eq("project_id", base.id)
      .order("sort_order", { ascending: true });

    const media: PublicMedia[] = (data ?? []).map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt_text ?? "",
      caption: null,
      role: "gallery",
      sortOrder: image.sort_order,
    }));

    return {
      ...base,
      media,
      cover: base.cover ?? media[0] ?? null,
    };
  }

  const [{ data: links }, { data: evidenceRows }] = await Promise.all([
    supabase
      .from("work_media")
      .select("work_id, media_id, role, sort_order")
      .eq("work_id", base.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("work_evidence")
      .select(
        "id, evidence_type, media_id, source_url, source_date, sort_order"
      )
      .eq("work_id", base.id)
      .eq("is_public", true)
      .order("sort_order", { ascending: true }),
  ]);

  const mediaIds = Array.from(
    new Set([
      ...(links ?? []).map((row) => row.media_id),
      ...(evidenceRows ?? [])
        .map((row) => row.media_id)
        .filter((value): value is string => Boolean(value)),
    ])
  );

  const assets = new Map<string, { url: string }>();
  const mediaTranslations = new Map<
    string,
    { alt_text: string | null; caption: string | null }
  >();

  if (mediaIds.length) {
    const [{ data: assetRows }, { data: mediaCopyRows }] = await Promise.all([
      supabase
        .from("media_assets")
        .select("id, url")
        .in("id", mediaIds)
        .eq("is_public", true),
      supabase
        .from("media_translations")
        .select("media_id, alt_text, caption")
        .in("media_id", mediaIds)
        .eq("locale", locale),
    ]);

    for (const asset of assetRows ?? []) {
      assets.set(asset.id, { url: asset.url });
    }
    for (const copy of mediaCopyRows ?? []) {
      mediaTranslations.set(copy.media_id, copy);
    }
  }

  const media = (links ?? [])
    .map((link) => mapMedia(link, assets, mediaTranslations))
    .filter((item): item is PublicMedia => Boolean(item));

  const evidenceIds = (evidenceRows ?? []).map((row) => row.id);
  const evidenceCopy = new Map<
    string,
    { title: string; description: string | null }
  >();

  if (evidenceIds.length) {
    const { data: rows } = await supabase
      .from("work_evidence_translations")
      .select("evidence_id, title, description")
      .in("evidence_id", evidenceIds)
      .eq("locale", locale);

    for (const row of rows ?? []) {
      evidenceCopy.set(row.evidence_id, {
        title: row.title,
        description: row.description,
      });
    }
  }

  const evidence: PublicEvidence[] = (evidenceRows ?? []).flatMap((row) => {
    const copy = evidenceCopy.get(row.id);
    if (!copy) return [];

    const evidenceMedia = row.media_id
      ? mapMedia(
          {
            media_id: row.media_id,
            role: "evidence",
            sort_order: row.sort_order,
          },
          assets,
          mediaTranslations
        )
      : null;

    return [
      {
        id: row.id,
        type: row.evidence_type,
        title: copy.title,
        description: copy.description,
        sourceUrl: row.source_url,
        sourceDate: row.source_date,
        media: evidenceMedia,
        sortOrder: row.sort_order,
      },
    ];
  });

  return {
    ...base,
    media,
    cover: media.find((item) => item.role === "cover") ?? base.cover,
    evidence,
  };
}

async function getV2Insights(locale: Locale) {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("insights")
    .select(
      "id, slug, tags, related_work_id, published_at, updated_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return null;
  if (!items?.length) return [];

  const ids = items.map((item) => item.id);
  const { data: translations, error: translationError } = await supabase
    .from("insight_translations")
    .select(
      "insight_id, title, excerpt, body, seo_title, seo_description"
    )
    .in("insight_id", ids)
    .eq("locale", locale)
    .eq("status", "published");

  if (translationError) return null;

  const copyById = new Map(
    (translations ?? []).map((row) => [row.insight_id, row])
  );

  return items.flatMap((item): PublicInsight[] => {
    const copy = copyById.get(item.id);
    if (!copy) return [];

    const body = copy.body as
      | { format?: string; html?: string }
      | null;

    return [
      {
        source: "v2",
        id: item.id,
        slug: item.slug,
        title: copy.title,
        excerpt: copy.excerpt,
        bodyHtml: body?.html ?? null,
        tags: item.tags ?? [],
        publishedAt: item.published_at,
        updatedAt: item.updated_at,
        relatedWorkId: item.related_work_id,
        seoTitle: copy.seo_title,
        seoDescription: copy.seo_description,
      },
    ];
  });
}

async function getLegacyInsights() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, content, tags, published_at, updated_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];

  return data.map(
    (item): PublicInsight => ({
      source: "legacy",
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      bodyHtml: item.content,
      tags: item.tags ?? [],
      publishedAt: item.published_at,
      updatedAt: item.updated_at,
      relatedWorkId: null,
      seoTitle: null,
      seoDescription: null,
    })
  );
}

export async function getPublicInsights(locale: Locale = "en") {
  const v2 = await getV2Insights(locale);
  if (v2 !== null) return v2;
  return locale === "en" ? getLegacyInsights() : [];
}

export async function getPublicInsightDetail(
  slug: string,
  locale: Locale = "en"
) {
  const collection = await getPublicInsights(locale);
  return collection.find((item) => item.slug === slug) ?? null;
}

export async function getPublicExperiences(
  locale: Locale = "en"
): Promise<PublicExperience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(
      "id, company, role, description, start_date, end_date, is_current"
    )
    .order("start_date", { ascending: false });

  if (error || !data?.length) return [];

  const ids = data.map((item) => item.id);
  const { data: translations, error: translationError } = await supabase
    .from("experience_translations")
    .select("experience_id, role, description")
    .in("experience_id", ids)
    .eq("locale", locale);

  if (translationError) {
    if (locale === "id") return [];
    return data.map((item) => ({
      id: item.id,
      company: item.company,
      role: item.role,
      description: item.description,
      startDate: item.start_date,
      endDate: item.end_date,
      isCurrent: item.is_current,
    }));
  }

  const copyById = new Map(
    (translations ?? []).map((row) => [row.experience_id, row])
  );

  return data.flatMap((item): PublicExperience[] => {
    const copy = copyById.get(item.id);
    if (locale === "id" && !copy) return [];

    return [
      {
        id: item.id,
        company: item.company,
        role: copy?.role ?? item.role,
        description: copy?.description ?? item.description,
        startDate: item.start_date,
        endDate: item.end_date,
        isCurrent: item.is_current,
      },
    ];
  });
}

export async function getPublicCapabilities(
  locale: Locale = "en"
): Promise<PublicCapability[]> {
  const supabase = await createClient();
  const { data: capabilities, error } = await supabase
    .from("capabilities")
    .select("id, category, level, sort_order")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (!error && capabilities) {
    if (!capabilities.length) return [];

    const ids = capabilities.map((item) => item.id);
    const { data: translations, error: translationError } = await supabase
      .from("capability_translations")
      .select("capability_id, name, description")
      .in("capability_id", ids)
      .eq("locale", locale);

    if (translationError && locale === "id") return [];

    const copyById = new Map(
      (translations ?? []).map((row) => [row.capability_id, row])
    );

    return capabilities.flatMap((item): PublicCapability[] => {
      const copy = copyById.get(item.id);
      if (!copy) return [];
      return [
        {
          id: item.id,
          name: copy.name,
          description: copy.description,
          category: item.category,
          level: item.level as "primary" | "working" | "familiar",
          sortOrder: item.sort_order,
        },
      ];
    });
  }

  if (locale === "id") return [];

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, category, sort_order")
    .order("sort_order", { ascending: true });

  return (skills ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: null,
    category:
      item.category === "design"
        ? "research-design"
        : item.category === "tools"
          ? "tools"
          : "engineering",
    level: "working" as const,
    sortOrder: item.sort_order,
  }));
}

export async function getPublicAbout(
  locale: Locale = "en"
): Promise<PublicAbout> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("about")
    .select("bio, philosophy, hobbies, photo_url")
    .limit(1)
    .maybeSingle();

  return {
    bio: locale === "en" ? data?.bio ?? null : null,
    philosophy: locale === "en" ? data?.philosophy ?? null : null,
    hobbies: locale === "en" ? data?.hobbies ?? null : null,
    photoUrl: data?.photo_url ?? null,
  };
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["general", "social", "cv", "profile"]);

  const map = Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value])
  ) as Record<string, Record<string, string>>;

  return {
    general: map.general ?? {},
    social: map.social ?? {},
    cv: map.cv ?? {},
    profile: map.profile ?? {},
  };
}


export async function getContentRedirect(
  contentType: "work" | "insight",
  oldSlug: string,
  locale: Locale = "en"
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_redirects")
    .select("new_slug")
    .eq("content_type", contentType)
    .eq("locale", locale)
    .eq("old_slug", oldSlug)
    .maybeSingle();

  if (error) return null;
  return data?.new_slug ?? null;
}
