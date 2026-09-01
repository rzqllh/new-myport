// ─── Database row types (matches Supabase schema) ────────────────────────────

export type ProjectStatus = "draft" | "published";
export type SkillCategory = "frontend" | "backend" | "design" | "tools";

export interface EvidenceItem {
  kind: "repository" | "screenshot" | "redacted_excerpt" | "document";
  label: string;
  label_id?: string;
  url?: string;
  caption?: string;
  caption_id?: string;
  redacted?: boolean;
  status?: "available" | "pending";
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  description_id: string | null;
  context: string | null;
  decision: string | null;
  outcome: string | null;
  context_id: string | null;
  decision_id: string | null;
  outcome_id: string | null;
  evidence_items: EvidenceItem[];
  role: string | null;
  category: string | null;
  tech_stack: string[];
  featured: boolean;
  sort_order: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface ProjectWithImages extends Project {
  project_images: ProjectImage[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  tags: string[];
  status: ProjectStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  description_id: string | null;
  context: string | null;
  decision: string | null;
  outcome: string | null;
  context_id: string | null;
  decision_id: string | null;
  outcome_id: string | null;
  evidence_items: EvidenceItem[];
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string | null;
  proficiency: number;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  is_spam: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
}

export interface About {
  id: string;
  bio: string | null;
  philosophy: string | null;
  hobbies: string | null;
  photo_url: string | null;
}

// ─── Site Settings value shapes ───────────────────────────────────────────────

export interface GeneralSettings {
  site_title: string;
  tagline: string;
}

export interface SocialSettings {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface SeoSettings {
  meta_description: string;
  og_image: string;
}

export interface CvSettings {
  url: string;
}

// ─── Contact form ─────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  body: string;
  turnstileToken: string;
}
