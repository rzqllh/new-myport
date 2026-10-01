export type Locale = "en" | "id";
export type PublishStatus = "draft" | "published" | "archived";
export type TranslationStatus = "draft" | "published";
export type WorkDiscipline =
  | "project-management"
  | "product"
  | "engineering"
  | "research-design";
export type WorkType = "case-study" | "product" | "tool" | "research" | "system";
export type CapabilityLevel = "primary" | "working" | "familiar";

export interface WorkItem {
  id: string;
  slug: string;
  status: PublishStatus;
  visibility: "public" | "unlisted";
  discipline: WorkDiscipline;
  work_type: WorkType;
  timeframe_start: string | null;
  timeframe_end: string | null;
  featured: boolean;
  sort_order: number;
  live_url: string | null;
  repository_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkTranslation {
  work_id: string;
  locale: Locale;
  status: TranslationStatus;
  title: string;
  short_title: string | null;
  summary: string | null;
  role: string | null;
  context: string | null;
  challenge: string | null;
  approach: string | null;
  decisions: unknown[];
  outcome: string | null;
  lessons: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export interface MediaAsset {
  id: string;
  provider: string | null;
  provider_id: string | null;
  url: string;
  media_type: "image" | "document" | "video" | "other";
  width: number | null;
  height: number | null;
  is_public: boolean;
  created_at: string;
}

export interface WorkEvidence {
  id: string;
  work_id: string;
  evidence_type:
    | "screenshot"
    | "architecture"
    | "repository"
    | "deployment"
    | "document-excerpt"
    | "research"
    | "metric-source"
    | "other";
  media_id: string | null;
  source_url: string | null;
  source_date: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
}

export interface Insight {
  id: string;
  slug: string;
  status: PublishStatus;
  tags: string[];
  related_work_id: string | null;
  cover_media_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsightTranslation {
  insight_id: string;
  locale: Locale;
  status: TranslationStatus;
  title: string;
  excerpt: string | null;
  body: {
    format: "html" | "tiptap";
    html?: string;
    document?: unknown;
  };
  seo_title: string | null;
  seo_description: string | null;
}

export interface SiteContent {
  namespace: string;
  locale: Locale;
  status: TranslationStatus;
  content: Record<string, unknown>;
  updated_at: string;
}

export interface ContentRedirect {
  id: string;
  content_type: "work" | "insight";
  content_id: string;
  locale: Locale;
  old_slug: string;
  new_slug: string;
  created_at: string;
}

export interface Capability {
  id: string;
  key: string;
  category:
    | "project-management"
    | "product"
    | "engineering"
    | "research-design"
    | "tools";
  level: CapabilityLevel;
  sort_order: number;
  is_visible: boolean;
}
