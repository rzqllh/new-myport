export interface ProjectDetailContent {
  slug: string;
  tagline: string;
  problem: string;
  solution: string;
  architecture: {
    title: string;
    description: string;
  }[];
  keyFeatures: string[];
  techChoices: {
    tech: string;
    reason: string;
  }[];
  metrics?: {
    label: string;
    value: string;
  }[];
}

export const PROJECT_DETAILS_DATA: Record<string, ProjectDetailContent> = {
  voltune: {
    slug: "voltune",
    tagline: "State-aware Windows performance, maintenance, network diagnostics, and recovery toolkit.",
    problem:
      "Windows administration, performance tuning, and network troubleshooting often require dozens of fragmented CLI tools, disjointed PowerShell scripts, and registry tweaks that lack unified state awareness and safe rollback mechanisms.",
    solution:
      "Voltune provides a structured, modular Python and PowerShell toolkit that safely queries hardware telemetry, audits background services, optimizes network sockets, and applies reversible system tuning profiles.",
    architecture: [
      {
        title: "Hardware & Telemetry Engine",
        description:
          "Directly interfaces with Windows Management Instrumentation (WMI) and Win32 APIs to extract CPU states, memory usage, disk status, and thermal profiles.",
      },
      {
        title: "Network Socket & Latency Diagnostics",
        description:
          "Executes packet loss probes, DNS benchmark analysis, TCP window auto-tuning checks, and network adapter MTU calibration.",
      },
      {
        title: "Reversible Tuning & Registry Sandbox",
        description:
          "All system tweaks create automated restore snapshots before modification, guaranteeing safe rollback of system configurations.",
      },
      {
        title: "Modular Maintenance Pipeline",
        description:
          "Automates DISM component store cleanup, SFC integrity checks, temporary cache purging, and telemetry bloatware suppression.",
      },
    ],
    keyFeatures: [
      "Hardware telemetry and thermal sensor monitoring",
      "Automated DISM/SFC system integrity verification",
      "TCP/IP socket buffer and DNS benchmark optimizer",
      "Zero-dependency modular Python CLI architecture",
      "Automatic registry backup and 1-click restore snapshots",
    ],
    techChoices: [
      {
        tech: "Python",
        reason: "Fast development of cross-subsystem orchestration and structured data parsing.",
      },
      {
        tech: "Win32 / WMI APIs",
        reason: "Low-level access to kernel objects, performance counters, and device drivers.",
      },
      {
        tech: "PowerShell",
        reason: "Execution of native elevated administrative commands and service management.",
      },
    ],
  },

  forma: {
    slug: "forma",
    tagline: "Privacy-first visual finishing workspace for designers: metadata cleanup, watermarks, resizing, and export.",
    problem:
      "Designers frequently need to scrub sensitive metadata (EXIF/GPS), apply client review watermarks, and export responsive variants without opening heavy design software or uploading confidential assets to third-party cloud converters.",
    solution:
      "Forma operates 100% client-side in the browser using HTML5 Canvas API and Web Workers, enabling instant, zero-upload image refinement, batch watermarking, EXIF sanitization, and format conversion.",
    architecture: [
      {
        title: "Client-Side EXIF Sanitization",
        description:
          "Parses binary image headers and strips GPS tags, camera serial numbers, and author identifiers directly in browser memory.",
      },
      {
        title: "Hardware-Accelerated Canvas Engine",
        description:
          "Renders multi-layer watermarks, typography overlays, and custom blend modes with viewport zooming and pan controls.",
      },
      {
        title: "Batch Web Worker Pipeline",
        description:
          "Processes multi-file conversions (WebP, PNG, JPEG, AVIF) in background threads without freezing the main UI thread.",
      },
    ],
    keyFeatures: [
      "100% Client-Side zero-cloud image processing",
      "Instant EXIF and GPS geolocation metadata scrubbing",
      "Dynamic typography and logo watermarking presets",
      "Batch WebP / AVIF export with lossless compression",
      "Adaptive aspect ratio and social preset resizing",
    ],
    techChoices: [
      {
        tech: "TypeScript & React",
        reason: "Declarative state management for multi-layer canvas composition.",
      },
      {
        tech: "HTML5 Canvas API",
        reason: "Pixel manipulation, sub-sampling, and image rasterization in memory.",
      },
      {
        tech: "Tailwind CSS",
        reason: "Responsive finishing tools and high-contrast control panels.",
      },
    ],
  },

  lumina: {
    slug: "lumina",
    tagline: "Production tracking and shot management workspace for video and photography teams.",
    problem:
      "Creative agencies and video production crews struggle with fragmented tracking across spreadsheets, disorganized raw shot logs, missed client milestones, and delayed asset approvals.",
    solution:
      "Lumina centralizes shoot schedules, shot checklists, crew assignments, and client review cycles into an intuitive, responsive workspace designed for on-set and studio use.",
    architecture: [
      {
        title: "Live Milestone & Shot Planner",
        description:
          "Interactive timeline and shot tracker categorized by scene, camera setup, lighting notes, and talent requirements.",
      },
      {
        title: "Asset Review & Deliverable Sync",
        description:
          "Version-controlled deliverable tracking with status tags (Review, Approved, Re-shoot, Finalized).",
      },
      {
        title: "Mobile-First On-Set Interface",
        description:
          "High-contrast dark theme optimized for tablet and phone viewports in low-light production studio environments.",
      },
    ],
    keyFeatures: [
      "Shot breakdown by scene, lens, and lighting setup",
      "Real-time shoot progress and deliverable milestones",
      "Client asset approval and revision tracking",
      "Mobile-optimized touch interface for field production",
      "Production budget and crew gear inventory tracker",
    ],
    techChoices: [
      {
        tech: "Next.js & React",
        reason: "Server-side rendering for instant page transitions and SEO metadata.",
      },
      {
        tech: "Tailwind CSS",
        reason: "Rapid development of sleek, high-contrast dark mode interfaces.",
      },
      {
        tech: "Vercel",
        reason: "Worldwide edge deployment and automated previews.",
      },
    ],
  },

  yomirra: {
    slug: "yomirra",
    tagline: "High-performance source-powered web reader for digital comics, manga, and webtoons.",
    problem:
      "Online reading platforms often suffer from heavy ads, sluggish image pagination, poor vertical scrolling on mobile devices, and lack of offline reading persistence.",
    solution:
      "Yomirra delivers a distraction-free reading experience with adaptive image pre-fetching, smooth continuous vertical webtoon mode, customizable layout themes, and local chapter caching.",
    architecture: [
      {
        title: "Intelligent Pre-fetch Pipeline",
        description:
          "Pre-buffers upcoming chapter pages in the background based on scroll velocity to eliminate load pauses.",
      },
      {
        title: "Dual Layout Engine",
        description:
          "Supports both continuous vertical webtoon mode and traditional paginated dual-page spread modes.",
      },
      {
        title: "Local Reading State & Offline Cache",
        description:
          "Saves reading history, bookmark positions, and chapter progress in local storage for instant reload.",
      },
    ],
    keyFeatures: [
      "Continuous vertical webtoon scroll",
      "Smart image pre-fetching based on viewport velocity",
      "Adaptive dark / OLED reading themes to reduce eye strain",
      "Local reading progress synchronization",
      "Keyboard shortcut navigation (Arrow keys, J/K scrolling)",
    ],
    techChoices: [
      {
        tech: "Next.js & React",
        reason: "Optimized route caching and fast dynamic page rendering.",
      },
      {
        tech: "TypeScript",
        reason: "Predictable state management for complex zoom and scroll behaviors.",
      },
      {
        tech: "Tailwind CSS",
        reason: "Minimalist reading controls with distraction-free layout styling.",
      },
    ],
  },

  "mawmaw-interior": {
    slug: "mawmaw-interior",
    tagline: "Editorial showcase and spatial portfolio for modern architectural & interior design studios.",
    problem:
      "High-end interior design studios need digital portfolios that reflect architectural sophistication, spacious visual rhythm, and refined typography without feeling like generic templates.",
    solution:
      "Mawmaw Interior Studio features bespoke editorial layouts, smooth layout transitions, high-resolution project showcases, and tactile interaction design tailored for architecture clients.",
    architecture: [
      {
        title: "Editorial Spatial Layout",
        description:
          "Carefully calibrated typography pairings and whitespace grids inspired by contemporary architectural monographs.",
      },
      {
        title: "Fluid Micro-Interactions",
        description:
          "Layout transitions that guide the viewer through interior projects without visual noise.",
      },
      {
        title: "Responsive Image Grid",
        description:
          "Adaptive picture elements serving responsive formats tailored to high-resolution desktop and mobile screens.",
      },
    ],
    keyFeatures: [
      "Editorial typography hierarchy and spacious margins",
      "High-resolution project photography gallery",
      "Studio philosophy and spatial design methodology breakdown",
      "Client inquiry and project consultation contact flow",
    ],
    techChoices: [
      {
        tech: "Next.js & TypeScript",
        reason: "Modern static-site generation with dynamic routing.",
      },
      {
        tech: "Tailwind CSS",
        reason: "Precise control over responsive typography and custom spacing tokens.",
      },
      {
        tech: "Framer Motion",
        reason: "Subtle page transitions and scroll-triggered narrative reveals.",
      },
    ],
  },

  "hadzkashop-pos": {
    slug: "hadzkashop-pos",
    tagline: "Full-stack retail Point of Sale, inventory tracking, and sales analytics system.",
    problem:
      "Small and medium retail shops frequently struggle with slow manual checkout processes, inventory discrepancies, and lack of real-time daily profit reconciliation.",
    solution:
      "HadzkaShop POS streamlines store operations with quick barcode scanning, real-time inventory decrementing, receipt printing, and daily financial summary reports.",
    architecture: [
      {
        title: "Rapid Checkout Subsystem",
        description:
          "Barcode scanner integration, instant item search, multi-payment support, and automatic discount calculation.",
      },
      {
        title: "Inventory & Stock Lifecycle",
        description:
          "Low-stock alert thresholds, supplier tracking, purchase order logging, and multi-category management.",
      },
      {
        title: "Sales Analytics & Reconciliation",
        description:
          "Calculates daily gross/net revenue, top-selling SKUs, cashier shift balances, and printable receipts.",
      },
    ],
    keyFeatures: [
      "Instant barcode scan and keyboard-driven checkout",
      "Real-time inventory deduction and low-stock triggers",
      "Multi-payment calculation (Cash, QRIS, Card)",
      "Daily profit/loss reconciliation dashboards",
      "Thermal printer receipt generation",
    ],
    techChoices: [
      {
        tech: "React & Tailwind CSS",
        reason: "Fast, responsive cashier user interface with low input latency.",
      },
      {
        tech: "Node.js & Express",
        reason: "Lightweight, reliable REST API for transaction handling.",
      },
      {
        tech: "SQL Database",
        reason: "ACID compliance ensuring accurate financial transaction integrity.",
      },
    ],
  },

  "summai": {
    slug: "summai",
    tagline: "Local-first meeting intelligence tool for mixed Indonesian/English meetings.",
    problem:
      "Modern multilingual meetings (Indonesian & English) lack private, subscription-free summarization tools that work directly on local hardware without sending proprietary recordings to third-party cloud aggregators.",
    solution:
      "SummAI provides a local-first meeting intelligence tool transcribing audio with Groq Whisper and synthesizing structured action items with Gemini, featuring bring-your-own-key privacy and zero cloud lock-in.",
    architecture: [
      {
        title: "High-Speed Audio Transcription",
        description:
          "Processes multi-speaker audio recordings via Groq Whisper for near-instant multilingual transcription.",
      },
      {
        title: "Contextual Meeting Synthesis",
        description:
          "Extracts structured decisions, action items, assignees, and key discussion points with Google Gemini.",
      },
      {
        title: "Local-First Storage Engine",
        description:
          "Stores meeting transcripts, search indexes, and summaries locally in SQLite with zero telemetry.",
      },
    ],
    keyFeatures: [
      "Optimized for mixed Indonesian and English meeting audio",
      "Near-instant Groq Whisper transcription pipeline",
      "Structured meeting minutes and action item synthesis via Gemini",
      "Bring-Your-Own-API-Key with zero subscription lock-in",
      "Local SQLite storage with exportable Markdown reports",
    ],
    techChoices: [
      {
        tech: "Next.js & React",
        reason: "Clean desktop and web interface for recording playback and review.",
      },
      {
        tech: "FastAPI & Python",
        reason: "Lightweight backend orchestration for audio ingestion and LLM calls.",
      },
      {
        tech: "SQLite",
        reason: "Zero-configuration local-first persistence.",
      },
    ],
  },

  "rangkai": {
    slug: "rangkai",
    tagline: "Interactive AI specification builder turning raw software ideas into execution-ready Build Packs.",
    problem:
      "Developers and founders frequently struggle to provide comprehensive context, architecture boundaries, and file plans when prompting AI coding agents, leading to hallucinations and generic boilerplate.",
    solution:
      "Rangkai conducts a structured interactive interview to clarify scope, tech stack choices, and non-goals, generating an execution-ready Build Pack tailored for agents like Claude Code, Gemini Antigravity, and Codex.",
    architecture: [
      {
        title: "Adaptive Requirement Interview",
        description:
          "Dynamically probes underspecified requirements, system boundaries, and technology trade-offs.",
      },
      {
        title: "Build Pack Specification Generator",
        description:
          "Compiles architectural blueprints, design token rules, API contracts, and implementation step matrices.",
      },
      {
        title: "Agent Context Optimizer",
        description:
          "Formats output specifications to maximize prompt comprehension for autonomous coding agents.",
      },
    ],
    keyFeatures: [
      "Guided interactive requirement discovery interview",
      "Structured Build Pack generation ready for coding agents",
      "Architecture, tech stack, and constraint hardening",
      "Modular Markdown and JSON export options",
    ],
    techChoices: [
      {
        tech: "TypeScript",
        reason: "Strict typing for interview state machines and schema validators.",
      },
    ],
  },

  "bca-mobile-ui-analysis": {
    slug: "bca-mobile-ui-analysis",
    tagline: "Usability research and interface redesign for mobile banking using User-Centered Design and A/B Testing.",
    problem:
      "Mobile banking interfaces frequently exhibit dense navigation menus, confusing transaction verification steps, and high cognitive load for novice and power users.",
    solution:
      "Conducted structured quantitative usability research, developed user task models, and redesigned the mobile banking UI using iterative User-Centered Design (UCD) and statistical A/B testing methodologies.",
    architecture: [
      {
        title: "Quantitative Usability Benchmarking",
        description:
          "Measured Time-on-Task, System Usability Scale (SUS), and Error Rate across core financial workflows.",
      },
      {
        title: "User-Centered Design Iteration",
        description:
          "Redesigned navigation hierarchies, biometric confirmation flows, and balance disclosure privacy toggles.",
      },
      {
        title: "A/B Usability Experimentation",
        description:
          "Compared task completion efficiency and error reduction between baseline and redesigned prototypes.",
      },
    ],
    keyFeatures: [
      "Rigorous user research with real banking user cohorts",
      "A/B usability testing methodology comparing interaction flows",
      "Streamlined transfer, QR payment, and account statement journeys",
      "Academic research thesis (Gunadarma University - GPA 3.54/4.00)",
    ],
    techChoices: [
      {
        tech: "Figma & Prototyping",
        reason: "High-fidelity interactive prototypes with realistic component behaviors.",
      },
      {
        tech: "User-Centered Design (UCD)",
        reason: "Framework prioritizing human mental models over legacy technical constraints.",
      },
      {
        tech: "A/B Testing & SUS Metrics",
        reason: "Objective validation of usability and user satisfaction improvements.",
      },
    ],
    metrics: [
      { label: "Research Framework", value: "UCD & A/B Testing" },
      { label: "Degree", value: "Bachelor of Informatics" },
      { label: "Academic Standing", value: "GPA 3.54 / 4.00" },
    ],
  },
};

export const FALLBACK_PROJECTS = [
  {
    id: "p-lumina",
    slug: "lumina",
    title: "Lumina",
    description: "Personal project operating system for photographers and videographers -- manages a project from deposit through preparation, production, delivery, and payment, with project finance tracking, a structured brief builder, and public client status links.",
    role: "Full-Stack Developer",
    category: "web-dev",
    tech_stack: ["React", "TypeScript", "Vite", "Supabase", "Tailwind CSS"],
    status: "published",
    featured: true,
    github_url: "https://github.com/rzqllh/Lumina",
    demo_url: "https://lumina-azure-beta.vercel.app",
    cover_url: null,
  },
  {
    id: "p-mawmaw",
    slug: "mawmaw-interior",
    title: "Mawmaw Interior Studio",
    description: "Public site and admin CMS for a premium interior design and furniture studio -- manages projects, articles, services, and site settings, with a client consultation flow and published portfolio content.",
    role: "Full-Stack Developer & Designer",
    category: "web-dev",
    tech_stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Supabase Auth", "Tailwind CSS"],
    status: "published",
    featured: true,
    github_url: "https://github.com/rzqllh/Mawmaw-landing",
    demo_url: "https://mawmaw-interior.vercel.app",
    cover_url: null,
  },
  {
    id: "p-summai",
    slug: "summai",
    title: "SummAI",
    description: "Local-first meeting intelligence tool built for mixed Indonesian/English meetings -- transcribes audio with Groq Whisper and synthesizes structured summaries with Gemini. Bring-your-own-API-key, self-hostable, no hosted middleware or subscription.",
    role: "Full-Stack Developer",
    category: "web-dev",
    tech_stack: ["Next.js", "FastAPI", "SQLite", "Groq Whisper", "Google Gemini"],
    status: "published",
    featured: true,
    github_url: "https://github.com/rzqllh/SummAI",
    demo_url: null,
    cover_url: null,
  },
  {
    id: "p-rangkai",
    slug: "rangkai",
    title: "Rangkai",
    description: 'AI tool that interviews you to clarify a raw software idea, then generates a structured, execution-ready "Build Pack" for coding agents like Claude Code, Gemini Antigravity, and OpenAI Codex.',
    role: "Creator & Frontend Developer",
    category: "tools",
    tech_stack: ["TypeScript"],
    status: "published",
    featured: true,
    github_url: "https://github.com/rzqllh/Rangkai",
    demo_url: null,
    cover_url: null,
  },
  {
    id: "p-hadzkashop",
    slug: "hadzkashop-pos",
    title: "HadzkaShop Point of Sale",
    description: "Full-stack retail Point of Sale system for a small shop -- dynamic product catalog, cash and QRIS (Midtrans) payments, an automatic stock-movement ledger, and role-based access for owner and cashier.",
    role: "Full-Stack Developer",
    category: "web-dev",
    tech_stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Midtrans", "shadcn/ui"],
    status: "published",
    featured: false,
    github_url: "https://github.com/rzqllh/HadzkaShop_PoS",
    demo_url: "https://hadzka-shop.vercel.app",
    cover_url: null,
  },
  {
    id: "p-yomirra",
    slug: "yomirra",
    title: "Yomirra",
    description: "Mobile-first Progressive Web App for manga, comics, and webtoons with multi-source search across several built-in adapters, a local library with reading history and collections, offline chapter downloads, and Firebase-backed cloud sync.",
    role: "Full-Stack Developer",
    category: "web-dev",
    tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Firebase"],
    status: "published",
    featured: false,
    github_url: "https://github.com/rzqllh/Yomirra",
    demo_url: "https://yomirra.vercel.app",
    cover_url: null,
  },
  {
    id: "p-forma",
    slug: "forma",
    title: "Forma",
    description: "Privacy-first visual finishing workspace for designers, built initially around interior design workflows. Local-first browser processing to clean metadata, apply logo watermarks, resize/compress, batch process, and export finished assets without touching the original design.",
    role: "Creator & Frontend Developer",
    category: "tools",
    tech_stack: ["Next.js", "TypeScript", "Canvas API", "Cloudflare D1", "Tailwind CSS"],
    status: "published",
    featured: false,
    github_url: "https://github.com/rzqllh/Forma",
    demo_url: null,
    cover_url: null,
  },
  {
    id: "p-voltune",
    slug: "voltune",
    title: "Voltune",
    description: "A state-aware Windows performance, maintenance, network diagnostics, and recovery toolkit built as a Python CLI for Windows 11 -- safe by default, reversible by design, with verified mutations and audit logging for every session.",
    role: "Creator & Lead Developer",
    category: "tools",
    tech_stack: ["Python", "PowerShell", "Windows API"],
    status: "published",
    featured: false,
    github_url: "https://github.com/rzqllh/Voltune",
    demo_url: null,
    cover_url: null,
  },
  {
    id: "p-bca-mobile",
    slug: "bca-mobile-ui-analysis",
    title: "BCA Mobile Banking UI Usability Research",
    description: "Comprehensive usability analysis and interface redesign for mobile banking using User-Centered Design (UCD) and quantitative A/B testing methodology to streamline transactions.",
    role: "UX Researcher & UI Designer",
    category: "ui-ux",
    tech_stack: ["Figma", "User-Centered Design", "A/B Testing", "Usability Metrics"],
    status: "published",
    featured: false,
    github_url: null,
    demo_url: null,
    cover_url: null,
  },
];


