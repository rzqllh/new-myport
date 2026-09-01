// ─── Site Metadata ────────────────────────────────────────────────────────────
export const SITE_NAME = "Hafizh Rizqullah Prasetya";
export const SITE_TAGLINE = "Project Management Officer · IT & Strategy";
export const SITE_DESCRIPTION =
  "A case-file portfolio focused on IT delivery, project control, and the systems behind the work.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hafizhrizqullah.vercel.app";

// ─── Social Links ─────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  github: "https://github.com/rzqllh",
  linkedin: "",
  twitter: "",
  email: "mailto:",
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: "Case files", href: "/#case-register" },
  { label: "Experience", href: "/#experience-register" },
  { label: "Notes", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

// ─── Admin Navigation ─────────────────────────────────────────────────────────
export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "ChartBar" },
  { label: "Projects", href: "/admin/projects", icon: "FolderOpen" },
  { label: "Blog", href: "/admin/blog", icon: "Article" },
  { label: "About", href: "/admin/about", icon: "User" },
  { label: "Skills", href: "/admin/skills", icon: "Code" },
  { label: "Experience", href: "/admin/experience", icon: "Briefcase" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "ChatTeardrop" },
  { label: "Messages", href: "/admin/messages", icon: "Envelope" },
  { label: "Settings", href: "/admin/settings", icon: "Gear" },
] as const;

// ─── Project Categories ───────────────────────────────────────────────────────
export const PROJECT_CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Web Dev", value: "web-dev" },
  { label: "UI/UX", value: "ui-ux" },
  { label: "Project Management", value: "project-management" },
] as const;

// ─── Skill Categories ─────────────────────────────────────────────────────────
export const SKILL_CATEGORIES = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Design", value: "design" },
  { label: "Tools", value: "tools" },
] as const;
