import type { Locale } from "@/types/content";

export const SITE_CONTENT_NAMESPACES = [
  "navigation",
  "home.hero",
  "home.work",
  "home.capabilities",
  "home.insights",
  "about.intro",
  "work.index",
  "insights.index",
  "contact.intro",
  "footer",
] as const;

export type SiteContentNamespace =
  (typeof SITE_CONTENT_NAMESPACES)[number];

export interface SiteContentDefinition {
  label: string;
  description: string;
  fields: ReadonlyArray<{
    key: string;
    label: string;
    multiline?: boolean;
  }>;
}

export const SITE_CONTENT_DEFINITIONS: Record<
  SiteContentNamespace,
  SiteContentDefinition
> = {
  navigation: {
    label: "Navigation",
    description: "Public navigation labels. Routes stay stable.",
    fields: [
      { key: "work", label: "Work" },
      { key: "about", label: "About" },
      { key: "insights", label: "Insights" },
      { key: "contact", label: "Contact" },
      { key: "resume", label: "Resume" },
    ],
  },
  "home.hero": {
    label: "Home · Hero",
    description: "Primary identity and positioning on the home page.",
    fields: [
      { key: "status", label: "Availability / status" },
      { key: "name", label: "Display name" },
      { key: "positioning", label: "Positioning", multiline: true },
      { key: "primary_cta", label: "Primary CTA" },
      { key: "secondary_cta", label: "Secondary CTA" },
    ],
  },
  "home.work": {
    label: "Home · Work",
    description: "Introduction for selected Work.",
    fields: [
      { key: "title", label: "Section title" },
      { key: "intro", label: "Section introduction", multiline: true },
      { key: "cta", label: "View-all CTA" },
    ],
  },
  "home.capabilities": {
    label: "Home · Capabilities",
    description: "Bridge between project delivery, systems thinking, and implementation.",
    fields: [
      { key: "title", label: "Section title" },
      { key: "intro", label: "Section introduction", multiline: true },
    ],
  },
  "home.insights": {
    label: "Home · Insights",
    description: "Introduction for selected Insights.",
    fields: [
      { key: "title", label: "Section title" },
      { key: "intro", label: "Section introduction", multiline: true },
      { key: "cta", label: "View-all CTA" },
    ],
  },
  "about.intro": {
    label: "About",
    description: "Opening statement for the About page.",
    fields: [
      { key: "title", label: "Page title" },
      { key: "intro", label: "Introduction", multiline: true },
    ],
  },
  "work.index": {
    label: "Work index",
    description: "Opening copy for the Work collection.",
    fields: [
      { key: "title", label: "Page title" },
      { key: "intro", label: "Introduction", multiline: true },
    ],
  },
  "insights.index": {
    label: "Insights index",
    description: "Opening copy for the Insights collection.",
    fields: [
      { key: "title", label: "Page title" },
      { key: "intro", label: "Introduction", multiline: true },
    ],
  },
  "contact.intro": {
    label: "Contact",
    description: "Opening copy above the contact methods.",
    fields: [
      { key: "title", label: "Page title" },
      { key: "intro", label: "Introduction", multiline: true },
    ],
  },
  footer: {
    label: "Footer",
    description: "Final public-site statement and actions.",
    fields: [
      { key: "heading", label: "Heading" },
      { key: "body", label: "Body", multiline: true },
      { key: "contact_cta", label: "Contact CTA" },
      { key: "resume_cta", label: "Resume CTA" },
    ],
  },
};

export type SiteCopyBundle = Record<
  SiteContentNamespace,
  Record<string, string>
>;

const en: SiteCopyBundle = {
  navigation: {
    work: "Work",
    about: "About",
    insights: "Insights",
    contact: "Contact",
    resume: "Resume",
  },
  "home.hero": {
    status: "Open to relevant opportunities",
    name: "Hafizh Rizqullah Prasetya",
    positioning:
      "IT project management with hands-on experience in product development and technical implementation.",
    primary_cta: "View work",
    secondary_cta: "Resume",
  },
  "home.work": {
    title: "Selected work",
    intro:
      "A selection of project delivery, product, engineering, and research work with enough context to show what was actually done.",
    cta: "View all work",
  },
  "home.capabilities": {
    title: "How I work",
    intro:
      "My role is centered on project delivery, while product and technical experience helps me clarify requirements, follow issues, and work more effectively with implementation teams.",
  },
  "home.insights": {
    title: "Insights",
    intro:
      "Notes from projects, technical exploration, research, and day-to-day project practice.",
    cta: "View all insights",
  },
  "about.intro": {
    title: "About",
    intro:
      "I work in IT project management and stay close to the product and technical details that affect delivery.",
  },
  "work.index": {
    title: "Work",
    intro:
      "Selected work across project delivery, product systems, engineering, and research.",
  },
  "insights.index": {
    title: "Insights",
    intro:
      "Notes from real projects, technical exploration, research, and day-to-day project practice.",
  },
  "contact.intro": {
    title: "Contact",
    intro:
      "For relevant project, product, or technical conversations, use the form or reach out directly by email.",
  },
  footer: {
    heading: "Have a relevant project or role in mind?",
    body:
      "I am open to conversations around IT project delivery, product work, and technical implementation where my experience is relevant.",
    contact_cta: "Contact me",
    resume_cta: "View resume",
  },
};

const id: SiteCopyBundle = {
  navigation: {
    work: "Karya",
    about: "Tentang",
    insights: "Insight",
    contact: "Kontak",
    resume: "CV",
  },
  "home.hero": {
    status: "Terbuka untuk peluang yang relevan",
    name: "Hafizh Rizqullah Prasetya",
    positioning:
      "Berfokus di pengelolaan proyek IT, dengan pengalaman langsung di pengembangan produk dan implementasi teknis.",
    primary_cta: "Lihat karya",
    secondary_cta: "CV",
  },
  "home.work": {
    title: "Pilihan karya",
    intro:
      "Beberapa pekerjaan di pengelolaan proyek, produk, engineering, dan riset yang dilengkapi konteks mengenai apa yang benar-benar dikerjakan.",
    cta: "Lihat semua karya",
  },
  "home.capabilities": {
    title: "Cara saya bekerja",
    intro:
      "Fokus utama saya ada di pengelolaan dan delivery proyek. Pengalaman di sisi produk dan teknis membantu saya merapikan kebutuhan, menindaklanjuti isu, dan bekerja lebih efektif dengan tim implementasi.",
  },
  "home.insights": {
    title: "Insight",
    intro:
      "Catatan dari proyek, eksplorasi teknis, riset, dan praktik kerja yang benar-benar dijalani.",
    cta: "Lihat semua insight",
  },
  "about.intro": {
    title: "Tentang",
    intro:
      "Saya bekerja di pengelolaan proyek IT dan tetap cukup dekat dengan detail produk maupun teknis yang berpengaruh ke delivery.",
  },
  "work.index": {
    title: "Karya",
    intro:
      "Pilihan pekerjaan di pengelolaan proyek, pengembangan produk dan sistem, engineering, serta riset.",
  },
  "insights.index": {
    title: "Insight",
    intro:
      "Catatan dari proyek, eksplorasi teknis, riset, dan praktik kerja sehari-hari.",
  },
  "contact.intro": {
    title: "Kontak",
    intro:
      "Untuk diskusi terkait proyek, produk, atau pekerjaan teknis yang relevan, gunakan formulir atau hubungi saya langsung melalui email.",
  },
  footer: {
    heading: "Ada proyek atau peran yang relevan?",
    body:
      "Saya terbuka untuk diskusi seputar delivery proyek IT, pekerjaan produk, dan implementasi teknis yang sesuai dengan pengalaman saya.",
    contact_cta: "Hubungi saya",
    resume_cta: "Lihat CV",
  },
};

export const SITE_COPY_DEFAULTS: Record<Locale, SiteCopyBundle> = {
  en,
  id,
};

export function mergeSiteCopy(
  locale: Locale,
  rows: Array<{ namespace: string; content: Record<string, unknown> }>
) {
  const base = structuredClone(SITE_COPY_DEFAULTS[locale]);

  for (const row of rows) {
    if (!SITE_CONTENT_NAMESPACES.includes(row.namespace as SiteContentNamespace)) {
      continue;
    }

    const namespace = row.namespace as SiteContentNamespace;
    const values = Object.fromEntries(
      Object.entries(row.content ?? {}).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string"
      )
    );

    base[namespace] = { ...base[namespace], ...values };
  }

  return base;
}
