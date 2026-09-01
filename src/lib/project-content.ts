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
  terminalSnippet?: {
    command: string;
    output: string[];
  };
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
          "Directly interfaces with Windows Management Instrumentation (WMI) and Win32 APIs to extract real-time CPU states, memory usage, disk fragmentation, and thermal profiles.",
      },
      {
        title: "Network Socket & Latency Diagnostics",
        description:
          "Executes packet loss probes, DNS benchmark analysis, TCP window auto-tuning checks, and network adapter MTU calibration.",
      },
      {
        title: "Reversible Tuning & Registry Sandbox",
        description:
          "All system tweaks create automated restore snapshots before modification, guaranteeing zero risk of bricking system configurations.",
      },
      {
        title: "Modular Maintenance Pipeline",
        description:
          "Automates DISM component store cleanup, SFC integrity checks, temporary cache purging, and telemetry bloatware suppression.",
      },
    ],
    keyFeatures: [
      "Hardware telemetry & thermal sensor monitoring",
      "Automated DISM/SFC system integrity verification",
      "TCP/IP socket buffer & DNS benchmark optimizer",
      "Zero-dependency modular Python CLI architecture",
      "Automatic registry backup & 1-click restore snapshots",
    ],
    techChoices: [
      {
        tech: "Python 3.11+",
        reason: "Fast development of cross-subsystem orchestration and structured data parsing.",
      },
      {
        tech: "Win32 / WMI APIs",
        reason: "Low-level access to kernel objects, performance counters, and device drivers.",
      },
      {
        tech: "PowerShell Core",
        reason: "Execution of native elevated administrative commands and service management.",
      },
    ],
    terminalSnippet: {
      command: "voltune --diagnose --all --verbose",
      output: [
        "[+] Initializing Voltune Kernel Subsystem v1.2.0...",
        "[✓] WMI Hardware Monitor: AMD Ryzen 7 5800H (8C/16T) - Normal Temp: 48°C",
        "[✓] RAM Status: 16.0 GB Total | 6.2 GB In-Use (38.7%)",
        "[✓] Storage Check: NVMe SSD 1TB (Health: 99%, Trim: Active)",
        "[✓] Network Latency Test: 12ms avg (Packet Loss: 0.0%)",
        "[✓] Windows Component Store: Health verified (0 corrupted packages)",
        "[★] System State: OPTIMAL. Tuning profile 'performance-v2' active.",
      ],
    },
    metrics: [
      { label: "Execution Speed", value: "< 1.2s" },
      { label: "Rollback Safety", value: "100%" },
      { label: "Supported Windows", value: "10 & 11" },
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
          "Renders multi-layer watermarks, typography overlays, and custom blend modes with 60 FPS viewport zooming and pan controls.",
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
      "Dynamic typography & logo watermarking presets",
      "Batch WebP / AVIF export with lossless compression",
      "Adaptive aspect ratio & social preset resizing",
    ],
    techChoices: [
      {
        tech: "React 19 & TypeScript",
        reason: "Declarative state management for multi-layer canvas composition.",
      },
      {
        tech: "HTML5 Canvas API",
        reason: "Pixel manipulation, sub-sampling, and image rasterization in memory.",
      },
      {
        tech: "Web Workers",
        reason: "Asynchronous parallel compression without blocking the UI thread.",
      },
    ],
    metrics: [
      { label: "Data Uploaded", value: "0 KB (Local)" },
      { label: "Format Support", value: "PNG, JPG, WebP" },
      { label: "Export Latency", value: "< 250ms" },
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
      "Real-time shoot progress & deliverable milestones",
      "Client asset approval & revision tracking",
      "Mobile-optimized touch interface for field production",
      "Production budget & crew gear inventory tracker",
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
        tech: "Vercel Edge Platform",
        reason: "Low-latency worldwide deployment and instant previews.",
      },
    ],
    metrics: [
      { label: "Live Deployment", value: "Vercel Production" },
      { label: "Mobile Responsive", value: "100%" },
      { label: "Workflow Efficiency", value: "+40%" },
    ],
  },

  yomirra: {
    slug: "yomirra",
    tagline: "High-performance source-powered web reader for digital comics, manga, and webtoons.",
    problem:
      "Online reading platforms often suffer from heavy ads, sluggish image pagination, poor vertical scrolling on mobile devices, and lack of offline reading persistence.",
    solution:
      "Yomirra delivers a distraction-free, lightning-fast reading experience with adaptive image pre-fetching, smooth continuous vertical webtoon mode, customizable layout themes, and local chapter caching.",
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
          "Saves reading history, bookmark positions, and chapter progress in IndexedDB for instant reload.",
      },
    ],
    keyFeatures: [
      "Zero-interruption continuous vertical webtoon scroll",
      "Smart image pre-fetching based on viewport velocity",
      "Adaptive dark / OLED reading themes to reduce eye strain",
      "IndexedDB local reading progress synchronization",
      "Keyboard shortcut navigation (Arrow keys, J/K scrolling)",
    ],
    techChoices: [
      {
        tech: "Next.js App Router",
        reason: "Optimized route caching and fast dynamic page rendering.",
      },
      {
        tech: "React 19 & TypeScript",
        reason: "Predictable state management for complex zoom and scroll behaviors.",
      },
      {
        tech: "IndexedDB API",
        reason: "Client-side storage of reading history and offline chapters.",
      },
    ],
    metrics: [
      { label: "Page Load Time", value: "< 300ms" },
      { label: "Pre-fetch Buffer", value: "5 Pages Ahead" },
      { label: "License", value: "Apache-2.0" },
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
          "Carefully calibrated typography pairings and whitespace grids inspired by contemporary Swiss architectural monographs.",
      },
      {
        title: "Fluid Micro-Interactions",
        description:
          "Hardware-accelerated layout transitions that guide the viewer through interior projects without visual noise.",
      },
      {
        title: "Responsive Image Grid",
        description:
          "Adaptive picture elements serving WebP/AVIF formats tailored to desktop 4K displays and mobile screens.",
      },
    ],
    keyFeatures: [
      "Editorial typography hierarchy and spacious margins",
      "High-resolution project photography gallery",
      "Studio philosophy and spatial design methodology breakdown",
      "Client inquiry & project consultation contact flow",
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
    metrics: [
      { label: "Visual Aesthetic", value: "Cold Luxury" },
      { label: "Lighthouse Score", value: "98/100" },
      { label: "Live Demo", value: "Active" },
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
      "Instant barcode scan & keyboard-driven checkout",
      "Real-time inventory deduction & low-stock triggers",
      "Multi-payment calculation (Cash, QRIS, Card)",
      "Daily profit/loss reconciliation dashboards",
      "Thermal printer receipt generation",
    ],
    techChoices: [
      {
        tech: "React & Tailwind CSS",
        reason: "Fast, responsive cashier user interface with zero input lag.",
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
    metrics: [
      { label: "Checkout Time", value: "< 5s / transaction" },
      { label: "Inventory Accuracy", value: "100%" },
      { label: "Status", value: "Deployed" },
    ],
  },

  "cultural-heritage-repository": {
    slug: "cultural-heritage-repository",
    tagline: "National multimedia digital asset repository managing 100,395+ cultural treasures across 451 museums.",
    problem:
      "Indonesian cultural heritage records were scattered across hundreds of regional institutions with disparate data formats, hindering public research, national cataloging, and preservation efforts.",
    solution:
      "Architected and standardized a centralized digital asset repository consolidating 100,395 multimedia items and 30,930 registered cultural structures, enabling fast query retrieval for nationwide portals.",
    architecture: [
      {
        title: "Unified Metadata Taxonomy",
        description:
          "Established standardized schema definitions for cultural properties, decrees (SK), archaeological zones, and artifacts.",
      },
      {
        title: "High-Volume Query Optimization",
        description:
          "Optimized relational SQL indexing and caching layers to support search indexing across 451 museum inventories.",
      },
      {
        title: "Decree (SK) & Approval Workflow",
        description:
          "Digital workflow for tracking pending, verified, and approved cultural preservation legal decrees.",
      },
    ],
    keyFeatures: [
      "Centralized management of 100,395+ multimedia heritage assets",
      "Catalog of 30,930 registered objects, buildings, and sites",
      "Nationwide data consolidation across 451 museum institutions",
      "100% data integrity verified for government research portals",
    ],
    techChoices: [
      {
        tech: "PHP & MySQL",
        reason: "Enterprise database stability for high-volume relational cataloging.",
      },
      {
        tech: "SQL Architecture & Indexing",
        reason: "Optimized complex join queries across multi-institution datasets.",
      },
      {
        tech: "Data Verification Scripts",
        reason: "Automated deduplication and asset integrity checks.",
      },
    ],
    metrics: [
      { label: "Total Assets", value: "100,395+" },
      { label: "Museums Connected", value: "451 Nationwide" },
      { label: "Registered Sites", value: "30,930" },
    ],
  },

  "bca-mobile-ui-analysis": {
    slug: "bca-mobile-ui-analysis",
    tagline: "Usability research and interface redesign for mobile banking using User-Centered Design and A/B Testing.",
    problem:
      "Legacy mobile banking interfaces frequently exhibit dense navigation menus, confusing transaction verification steps, and high cognitive load for both novice and power users.",
    solution:
      "Conducted structured quantitative usability research, developed user task models, and redesigned the mobile banking UI using iterative User-Centered Design (UCD) and statistical A/B testing.",
    architecture: [
      {
        title: "Quantitative Usability Benchmarking",
        description:
          "Measured Time-on-Task (ToT), System Usability Scale (SUS), and Error Rate across core financial workflows.",
      },
      {
        title: "User-Centered Design (UCD) Iteration",
        description:
          "Redesigned navigation hierarchies, biometric confirmation flows, and balance disclosure privacy toggles.",
      },
      {
        title: "A/B Usability Experimentation",
        description:
          "Statistically compared task completion speed and error reduction between baseline and redesigned prototypes.",
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
        reason: "Objective data validation of usability and satisfaction improvements.",
      },
    ],
    metrics: [
      { label: "Research Framework", value: "UCD & A/B Testing" },
      { label: "User Satisfaction", value: "+35% SUS Score" },
      { label: "Task Completion", value: "+28% Faster" },
    ],
  },
};
