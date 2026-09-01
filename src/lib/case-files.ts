export type EvidenceKind = "repository" | "screenshot" | "redacted_excerpt" | "document";

export interface EvidenceItem {
  kind: EvidenceKind;
  label: string;
  label_id?: string;
  url?: string;
  caption?: string;
  caption_id?: string;
  redacted?: boolean;
  status?: "available" | "pending";
}

export interface CaseProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  description_id: string;
  role: string;
  category: string;
  tech_stack: string[];
  featured: boolean;
  sort_order: number;
  status: "published";
  context: string;
  context_id: string;
  decision: string;
  decision_id: string;
  outcome: string;
  outcome_id: string;
  evidence_items: EvidenceItem[];
  cover_url: string | null;
  cover_public_id: string | null;
}

export interface CaseExperience {
  id: string;
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
  context: string;
  context_id: string;
  decision: string;
  decision_id: string;
  outcome: string;
  outcome_id: string;
  evidence_items: EvidenceItem[];
}

export const FEATURED_CASES: CaseProject[] = [
  {
    id: "fallback-opspilot",
    slug: "opspilot",
    title: "OpsPilot",
    description: "A project-control workspace for dependencies, risks, decisions, and operational evidence.",
    description_id: "Workspace pengendalian proyek untuk dependensi, risiko, keputusan, dan bukti operasional.",
    role: "Product owner & developer",
    category: "Project control system",
    tech_stack: ["Next.js", "TypeScript", "Firestore", "Zod"],
    featured: true,
    sort_order: 1,
    status: "published",
    context: "Project delivery becomes difficult to audit when dependencies, decisions, and supporting evidence live in separate tools and message threads.",
    context_id: "Delivery proyek sulit ditelusuri ketika dependensi, keputusan, dan bukti pendukung tersebar di banyak alat dan percakapan.",
    decision: "Model project control as a traceable system: strict data contracts first, then service boundaries, timelines, and activity records that share one vocabulary.",
    decision_id: "Memodelkan project control sebagai sistem yang dapat ditelusuri: mulai dari kontrak data yang ketat, lalu service boundary, timeline, dan activity record dengan bahasa yang sama.",
    outcome: "The current repository establishes the reliability baseline: App Router foundations, typed contracts for projects, internal notes, and decisions, plus a separated service layer. Advanced AI and document generation remain explicitly out of scope for this phase.",
    outcome_id: "Repository saat ini membangun baseline reliability: fondasi App Router, kontrak bertipe untuk proyek, nota internal, dan keputusan, serta service layer yang terpisah. AI lanjutan dan pembuatan dokumen masih berada di luar fase ini.",
    evidence_items: [
      {
        kind: "repository",
        label: "Source repository",
        label_id: "Repository sumber",
        url: "https://github.com/rzqllh/ProjectManagement-ERP-Dashboard",
        caption: "Implementation and reference contracts for the Phase 0A baseline.",
        caption_id: "Implementasi dan kontrak referensi untuk baseline Phase 0A.",
      },
    ],
    cover_url: null,
    cover_public_id: null,
  },
  {
    id: "fallback-rangkai",
    slug: "rangkai",
    title: "Rangkai",
    description: "A planning engine that turns rough software ideas into structured, coding-agent-ready Build Packs.",
    description_id: "Planning engine yang mengubah ide software mentah menjadi Build Pack terstruktur dan siap dikerjakan coding agent.",
    role: "Product owner & developer",
    category: "Planning system",
    tech_stack: ["React", "TypeScript", "Hono", "Cloudflare", "Supabase"],
    featured: true,
    sort_order: 2,
    status: "published",
    context: "Coding agents can produce code quickly, but ambiguous inputs move unresolved product decisions into implementation, where they become rework.",
    context_id: "Coding agent dapat menghasilkan kode dengan cepat, tetapi input ambigu memindahkan keputusan produk yang belum selesai ke tahap implementasi dan akhirnya menjadi rework.",
    decision: "Put a planning layer before execution: ask one high-leverage question at a time, track confirmed and assumed decisions separately, and compile one canonical Build Pack.",
    decision_id: "Menempatkan planning layer sebelum eksekusi: menanyakan satu pertanyaan bernilai tinggi setiap kali, memisahkan keputusan confirmed dan assumed, lalu menyusun satu Build Pack kanonis.",
    outcome: "Rangkai now has a working domain model for adaptive planning, provenance-aware decisions, blueprint compilation, and target-specific exports for coding agents.",
    outcome_id: "Rangkai kini memiliki domain model untuk adaptive planning, decision provenance, kompilasi blueprint, dan export khusus untuk berbagai coding agent.",
    evidence_items: [
      {
        kind: "repository",
        label: "Source repository",
        label_id: "Repository sumber",
        url: "https://github.com/rzqllh/Rangkai",
        caption: "Application code, canonical product specification, and verification suite.",
        caption_id: "Kode aplikasi, spesifikasi produk kanonis, dan verification suite.",
      },
      {
        kind: "redacted_excerpt",
        label: "Redacted Build Pack excerpt",
        label_id: "Cuplikan Build Pack tersensor",
        caption: "A public-safe sample of the planning artifact. Upload pending.",
        caption_id: "Contoh artefak planning yang aman untuk publik. Menunggu unggahan.",
        redacted: true,
        status: "pending",
      },
    ],
    cover_url: null,
    cover_public_id: null,
  },
  {
    id: "fallback-summai",
    slug: "summai",
    title: "SummAI",
    description: "Local-first meeting intelligence that turns recordings into structured notes and accountable next actions.",
    description_id: "Meeting intelligence local-first yang mengubah rekaman menjadi catatan terstruktur dan tindak lanjut yang jelas.",
    role: "Product owner & developer",
    category: "Meeting intelligence",
    tech_stack: ["Next.js", "FastAPI", "Python", "Groq", "Gemini"],
    featured: true,
    sort_order: 3,
    status: "published",
    context: "Meeting recordings preserve what was said, but they do not create a usable decision record, assigned actions, or a format teams can circulate.",
    context_id: "Rekaman meeting menyimpan percakapan, tetapi tidak otomatis menghasilkan catatan keputusan, action item, atau format yang siap diedarkan ke tim.",
    decision: "Separate transcription from synthesis, keep meeting records local, and let the user choose a structured output matched to the meeting's purpose.",
    decision_id: "Memisahkan transkripsi dari sintesis, menyimpan data meeting secara lokal, dan memberi pengguna pilihan output terstruktur sesuai tujuan meeting.",
    outcome: "The application accepts recordings or raw transcripts, produces structured meeting outputs, and supports document export while keeping its storage local-first.",
    outcome_id: "Aplikasi menerima rekaman atau transkrip mentah, menghasilkan output meeting terstruktur, dan mendukung export dokumen dengan penyimpanan local-first.",
    evidence_items: [
      {
        kind: "repository",
        label: "Source repository",
        label_id: "Repository sumber",
        url: "https://github.com/rzqllh/SummAI",
        caption: "Frontend, processing pipeline, and local persistence implementation.",
        caption_id: "Implementasi frontend, processing pipeline, dan local persistence.",
      },
    ],
    cover_url: null,
    cover_public_id: null,
  },
];

export const EXPERIENCE_CASES: CaseExperience[] = [
  {
    id: "fallback-telkom",
    company: "Telkom Indonesia",
    role: "Project Management Officer (IT & Strategy)",
    description: "IT project coordination, delivery tracking, stakeholder alignment, reporting, and infrastructure-health monitoring.",
    start_date: "2024-03-01",
    end_date: null,
    is_current: true,
    sort_order: 1,
    context: "Multi-team IT initiatives depend on clear ownership, current delivery information, and communication that works for both technical and non-technical stakeholders.",
    context_id: "Inisiatif IT lintas tim membutuhkan ownership yang jelas, informasi delivery terbaru, serta komunikasi yang dipahami stakeholder teknis maupun nonteknis.",
    decision: "Use a consistent reporting rhythm to keep deliverables, bottlenecks, follow-ups, and infrastructure signals visible to the people responsible for acting on them.",
    decision_id: "Menggunakan ritme pelaporan yang konsisten agar deliverable, bottleneck, tindak lanjut, dan sinyal infrastruktur tetap terlihat oleh pihak yang perlu bertindak.",
    outcome: "More than two years coordinating IT delivery at Telkom Indonesia, including project documentation, cross-functional follow-up, and daily monitoring through Grafana.",
    outcome_id: "Lebih dari dua tahun mengoordinasikan delivery IT di Telkom Indonesia, termasuk dokumentasi proyek, tindak lanjut lintas fungsi, dan monitoring harian melalui Grafana.",
    evidence_items: [
      {
        kind: "redacted_excerpt",
        label: "Sanitized progress-report excerpt",
        label_id: "Cuplikan laporan progres tersensor",
        caption: "A public-safe excerpt from an actual reporting workflow. Upload pending.",
        caption_id: "Cuplikan aman untuk publik dari workflow pelaporan aktual. Menunggu unggahan.",
        redacted: true,
        status: "pending",
      },
    ],
  },
  {
    id: "fallback-ministry",
    company: "Ministry of Education, Culture, Research and Technology",
    role: "Computer Operator",
    description: "National cultural-heritage data operations, digital-asset management, verification, and technical support.",
    start_date: "2023-03-01",
    end_date: "2023-04-30",
    is_current: false,
    sort_order: 2,
    context: "National cultural-heritage records combined museum inventories, multimedia assets, approval status, and website data that had to remain accurate and retrievable.",
    context_id: "Data warisan budaya nasional menggabungkan inventaris museum, aset multimedia, status penetapan, dan data website yang harus tetap akurat serta mudah ditelusuri.",
    decision: "Apply a structured inventory and verification flow across museum, media, and heritage records, with documentation kept alongside each operational step.",
    decision_id: "Menerapkan alur inventarisasi dan verifikasi terstruktur untuk data museum, media, dan cagar budaya, dengan dokumentasi pada setiap tahap operasional.",
    outcome: "The work covered 451 museums and more than 100,000 multimedia assets while supporting accurate cultural-heritage information and digital operations.",
    outcome_id: "Pekerjaan mencakup 451 museum dan lebih dari 100.000 aset multimedia sekaligus mendukung akurasi informasi warisan budaya dan operasional digital.",
    evidence_items: [
      {
        kind: "redacted_excerpt",
        label: "Sanitized data-structure excerpt",
        label_id: "Cuplikan struktur data tersensor",
        caption: "A non-sensitive sample of the inventory structure. Upload pending.",
        caption_id: "Contoh nonsensitif dari struktur inventaris. Menunggu unggahan.",
        redacted: true,
        status: "pending",
      },
    ],
  },
];

export function localize<T extends object>(record: T, locale: string) {
  if (locale !== "id") return record;
  const source = record as Record<string, unknown>;
  const localized = { ...source };
  for (const key of ["description", "context", "decision", "outcome"]) {
    const translated = source[`${key}_id`];
    if (typeof translated === "string" && translated) localized[key] = translated;
  }
  return localized as T;
}

export function localizeEvidence(items: EvidenceItem[], locale: string) {
  if (locale !== "id") return items;
  return items.map((item) => ({
    ...item,
    label: item.label_id || item.label,
    caption: item.caption_id || item.caption,
  }));
}
