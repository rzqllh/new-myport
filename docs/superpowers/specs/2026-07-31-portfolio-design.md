# Portfolio + CMS Admin Dashboard — Design Specification

> **Design Read:** Developer/Designer/PMO hybrid portfolio for startup/cross-functional hiring managers, with a Premium & Creative visual language, leaning toward Next.js App Router + shadcn/ui + Motion + GSAP scroll-driven.
>
> **Dials:** Design Variance: 7 | Motion Intensity: 6 | Visual Density: 4

---

## 1. Product Summary

A personal portfolio website for **Hafizh Rizqullah Prasetya** that showcases his hybrid skillset: Project Management, UI/UX Design, and Web Development. The site targets startup hiring managers and cross-functional roles. It includes a **full CMS admin dashboard** so Hafizh can manage all content without touching code.

### 1.A Key Design Decisions (Post-Review)

> [!IMPORTANT]
> **Bilingual (EN/ID) deferred.** Target audience is startup hiring managers who read English. Bilingual doubles content creation work for every project/blog post with no proven recruiter demand for Indonesian. Removed from Phase 1-3. Can be added as a future enhancement if evidence emerges. All DB columns are English-only.

> [!IMPORTANT]
> **ERP Dashboard → Mawmaw Interior.** ERP Dashboard is an internal Telkom project with NDA/confidentiality risk. Swapped for **Mawmaw Interior** — Hafizh's own interior design studio project (Next.js + Payload + MongoDB), no confidentiality issues, full documentation available. Featured projects are now: **Mawmaw Interior**, **HadzkaShop POS**, **Yomirra**.

> [!IMPORTANT]
> **Project visuals strategy — no AI-generated mockups.** AI-generated imagery presented as product representations contradicts the "genuine craftsman" credibility this portfolio needs to establish, and violates anti-pattern #4 ("No fake project data presented as real"). Strategy instead:
> - **If screenshots exist:** Use real WIP screenshots from local dev/staging, labeled honestly as "In Development" or "Work in Progress."
> - **If nothing runs yet:** Minimize the project section on launch (show project cards with title + description + tech stack tags only, no hero images). The site carries on Hero + About + Skills + Experience + Contact until real visuals are added via admin.
> - Premium means genuine. Rough-but-real > polished-but-fake.

> [!NOTE]
> **GSAP license — closed.** Since April 2025, GSAP (including all premium plugins: ScrollTrigger, SplitText, etc.) is 100% free for commercial use. Non-issue.

## 2. User Personas

| Persona | Goal | Behavior |
|---|---|---|
| **Startup Hiring Manager** | Evaluate Hafizh's hybrid capability quickly | Scans hero → scrolls projects → checks about → contacts or downloads CV |
| **Technical Recruiter** | Find skills keywords, verify GitHub, download CV | Scans skills section, clicks GitHub link, downloads PDF |
| **Hafizh (Admin)** | Update projects, blog, about, skills, settings | Logs into `/admin`, uses CRUD interface to manage all content |

## 3. Pages & Routes

### 3.A Public Portfolio

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero + Featured Projects + About preview + Skills + Testimonials + CTA |
| `/about` | About | Full bio, experience timeline, education, philosophy |
| `/projects` | Projects | Filterable grid of all projects |
| `/projects/[slug]` | Project Detail | Full case study: problem, role, process, outcome, images, tech stack |
| `/blog` | Blog | List of blog posts with tags/categories |
| `/blog/[slug]` | Blog Post | Full article with rich content |
| `/contact` | Contact | Contact form + social links + CV download |

### 3.B Admin Dashboard

| Route | Page | Purpose |
|---|---|---|
| `/admin/login` | Auth | Supabase email/password login |
| `/admin` | Dashboard | Overview: recent messages, project count, blog post count |
| `/admin/projects` | Projects CRUD | List, create, edit, delete projects |
| `/admin/blog` | Blog CRUD | List, create, edit, delete blog posts |
| `/admin/about` | About Editor | Edit bio, philosophy, experience, education |
| `/admin/skills` | Skills Manager | Add, edit, reorder, delete skills/tools |
| `/admin/experience` | Experience Manager | Add, edit, delete work experience entries |
| `/admin/testimonials` | Testimonials Manager | Add, edit, delete testimonials |
| `/admin/messages` | Contact Messages | Inbox of contact form submissions, mark read/unread |
| `/admin/settings` | Site Settings | Logo, site title, social links, SEO defaults, CV upload |

## 4. Technology Stack

| Layer | Technology | Version | Free tier |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | Vercel free |
| Language | TypeScript | 5.x | — |
| Styling | Tailwind CSS | v4 | — |
| UI Components | shadcn/ui (Radix primitives) | latest | — |
| Icons | @phosphor-icons/react (duotone) | latest | — |
| Animation (primary) | Motion (framer-motion) | latest | — |
| Animation (scroll) | GSAP + ScrollTrigger | latest | Free (since Apr 2025) |
| Database | Supabase (PostgreSQL) | — | 500MB DB, 50K auth users |
| Image storage | Cloudinary | — | 25GB storage, 25GB bandwidth/mo |
| Auth | Supabase Auth (email/password) | — | Free |
| Spam protection | Cloudflare Turnstile | — | Free (unlimited, privacy-friendly) |
| Hosting | Vercel | — | Free hobby tier |
| Rich text editor | Tiptap (for blog/project descriptions) | latest | Free |

### 4.A Dependency Policy

- **Allowed without approval:** shadcn/ui components, Radix primitives, Phosphor icons, Tailwind plugins
- **Requires approval:** Any new animation library, any paid service, any database migration
- **Banned:** anime.js, lucide-react (replaced by Phosphor), emoji as icons, next-intl (deferred — no bilingual in MVP)

## 5. Visual Design System

### 5.A Design Direction Override

The ui-ux-pro-max tool recommended Brutalism. **This is overridden.** The user explicitly chose "Premium & Creative" — bold typography, subtle glass effects, smooth animations, agency feel. This is NOT brutalist.

### 5.B Typography

| Role | Font | Weight | Size (desktop) | Tracking |
|---|---|---|---|---|
| Display / Headlines | **Space Grotesk** | 700 | text-4xl → text-6xl | tracking-tighter |
| Body | **Archivo** | 400 | text-base | normal |
| Code / Mono accents | **JetBrains Mono** | 400 | text-sm | normal |

- Loaded via `next/font/google` — NO `<link>` tags
- Space Grotesk for headlines: geometric, bold, creative without being trendy
- Archivo for body: highly readable, professional, pairs well with geometric display fonts
- JetBrains Mono for code snippets and technical labels: reinforces the developer identity

### 5.C Color Palette

**Light Mode (default):**

| Token | Value | Usage |
|---|---|---|
| `--background` | `#FAFAFA` | Page background (cool off-white, not warm) |
| `--foreground` | `#0F172A` | Primary text (slate-900) |
| `--muted` | `#64748B` | Secondary text (slate-500) |
| `--accent` | `#2563EB` | Primary accent — Electric Blue (not AI-purple) |
| `--accent-foreground` | `#FFFFFF` | Text on accent |
| `--card` | `#FFFFFF` | Card surfaces |
| `--border` | `#E2E8F0` | Borders (slate-200) |
| `--destructive` | `#EF4444` | Error/delete actions |

**Dark Mode:**

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0A0A0B` | Page background (near-black, cool) |
| `--foreground` | `#F8FAFC` | Primary text (slate-50) |
| `--muted` | `#94A3B8` | Secondary text (slate-400) |
| `--accent` | `#3B82F6` | Primary accent — Blue-500 (slightly lighter for dark bg contrast) |
| `--accent-foreground` | `#FFFFFF` | Text on accent |
| `--card` | `#111113` | Card surfaces |
| `--border` | `#1E293B` | Borders (slate-800) |
| `--destructive` | `#F87171` | Error/delete actions |

**Color rules:**
- ONE accent (Electric Blue) locked across the entire site
- Cool neutrals (Slate) — no warm grays
- No AI-purple, no random gradients, no neon
- Glass effects use `backdrop-blur-xl` + `bg-white/80` (light) or `bg-black/60` (dark) with 1px border

### 5.D Shape & Spacing

| Token | Value |
|---|---|
| Border radius (buttons, inputs) | `8px` (rounded-lg) |
| Border radius (cards) | `12px` (rounded-xl) |
| Border radius (modals) | `16px` (rounded-2xl) |
| Base spacing unit | `4px` (Tailwind default) |
| Content max-width | `max-w-[1400px]` |
| Section padding | `py-24 md:py-32` |

**Shape consistency lock:** All-soft radius system. No mixing sharp corners with pills.

### 5.E Motion Design

| Animation | Library | Trigger | Behavior |
|---|---|---|---|
| Page transitions | Motion `AnimatePresence` | Route change | Fade + slight Y translate (200ms) |
| Scroll reveal | Motion `whileInView` | Viewport entry | Fade up + stagger children (60ms delay) |
| Hover states | Motion `whileHover` | Pointer | Scale 1.02 + shadow lift (spring) |
| Scroll-pinned sections | GSAP ScrollTrigger | Scroll position | Only if cinematic scroll section is needed |
| Button press | Motion `whileTap` | Click | Scale 0.98 (tactile push) |
| Theme toggle | Motion `layout` | State change | Smooth icon morph |

- All motion gated by `prefers-reduced-motion` → degrades to instant/static
- Spring physics: `stiffness: 100, damping: 20` default
- No infinite loops, no gratuitous animation
- Every animation must answer: "what does this communicate?"

## 6. Page-by-Page Design

### 6.A Home (`/`)

**Hero Section:**
- Layout: **Split screen** (left text, right visual) — not centered (DESIGN_VARIANCE 7)
- Left: Eyebrow ("PMO · Designer · Developer") + Headline (max 2 lines, Space Grotesk 700, text-5xl md:text-6xl) + Subtext (max 20 words) + 2 CTAs (Primary: "Let's Work Together" → /contact, Secondary: "View Projects" → /projects)
- Right: Stylized photo or abstract visual (placeholder for now)
- Top padding: max `pt-24`
- Hero fits in initial viewport — no scroll to find CTA

**Featured Projects (3 cards):**
- Layout: Asymmetric grid (1 large + 2 stacked, NOT 3 equal columns)
- Each card: project image (placeholder) + title + role tags + hover overlay with "View Case Study" link
- Scroll-reveal stagger entry

**About Preview:**
- Layout: Left-aligned text block, max-w-[65ch]
- Short bio paragraph + "Read More" link to /about
- NO eyebrow (eyebrow already used in hero)

**Skills/Tech Stack:**
- Layout: Horizontal scroll-snap pills or compact tag cloud
- NOT a boring bullet list
- Grouped: Frontend, Backend, Design, Tools

**Testimonials:**
- Layout: Single rotating quote (max 3 lines) with attribution
- Only shown if admin has added testimonials

**Footer CTA:**
- Full-width section: "Have a project in mind?" + Contact button + social links
- CV download as secondary link

### 6.B About (`/about`)

- Full bio from admin CMS
- Experience timeline (vertical, alternating sides on desktop, single column mobile)
- Education section
- Philosophy/approach section
- Hobbies/interests (the restaurants + travel + Mobile Legends + Witcher 3 from your GitHub)

### 6.C Projects (`/projects`)

- Filterable grid (category tags: "Web Dev", "UI/UX", "Project Management")
- Cards: image + title + description excerpt + tech stack tags
- Click → `/projects/[slug]`

### 6.D Project Detail (`/projects/[slug]`)

- Hero: full-width project image
- Sections: Overview → Problem → Role → Process → Outcome → Tech Stack → Gallery
- Back button to /projects
- Next/Previous project navigation

### 6.E Blog (`/blog`) & Blog Post (`/blog/[slug]`)

- Clean list layout with date, title, excerpt, tags
- Blog post: rich text from Tiptap editor, code blocks with syntax highlighting
- Estimated read time

### 6.F Contact (`/contact`)

- Split layout: left = form (name, email, subject, message), right = social links + email + CV download
- Form submits to Supabase `messages` table
- Success toast on submission

## 7. Admin Dashboard Design

- **Layout:** Sidebar navigation + main content area (standard dashboard pattern)
- **Auth:** Supabase email/password, single admin user
- **Components:** shadcn/ui tables, forms, dialogs, toasts
- **Image uploads:** Cloudinary upload widget
- **Rich text:** Tiptap editor for blog posts and project descriptions
- **Theme:** Follows portfolio theme (light/dark toggle)
- **NO public access** — all `/admin/*` routes behind auth middleware

## 8. Database Schema (Supabase)

### Tables

| Table | Key columns |
|---|---|
| `projects` | id, slug, title, description, role, category, tech_stack[], featured, sort_order, status (draft/published), created_at, updated_at |
| `project_images` | id, project_id (FK), url (Cloudinary), alt_text, sort_order |
| `blog_posts` | id, slug, title, content, excerpt, tags[], status (draft/published), published_at, created_at, updated_at |
| `experiences` | id, company, role, description, start_date, end_date, is_current, sort_order |
| `skills` | id, name, category (frontend/backend/design/tools), icon, proficiency, sort_order |
| `testimonials` | id, name, role, company, quote, avatar_url, sort_order, is_visible |
| `messages` | id, name, email, subject, body, is_read, is_spam, created_at |
| `site_settings` | id, key, value (JSON) — stores logo, socials, SEO, CV URL, etc. |
| `about` | id, bio, philosophy, hobbies, photo_url |

- English-only columns (bilingual deferred — see Section 1.A)
- Row Level Security (RLS) enabled: public read for published content, write only for authenticated admin
- `messages` table includes `is_spam` flag for Turnstile-flagged submissions

## 9. i18n Strategy (Deferred)

> [!NOTE]
> Bilingual support (EN/ID) is **deferred** from MVP. See Section 1.A for rationale.
> When implemented in a future phase, the planned approach is:
> - Library: `next-intl`
> - URL structure: `/en/...` and `/id/...` (path-based routing)
> - DB schema migration: add `_id` columns alongside existing English columns
> - Language toggle in navbar, persisted via cookie

For now: English-only. All UI strings hardcoded or in a single `messages/en.json` for easy future extraction.

## 10. Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `< 640px` (mobile) | Single column, hamburger menu, stacked hero, full-width cards |
| `640-768px` (large mobile) | Minor adjustments, 2-col grids where appropriate |
| `768-1024px` (tablet) | 2-col project grid, sidebar collapse in admin |
| `1024-1280px` (laptop) | Full layout, 3-col project grid |
| `1280px+` (desktop) | Max-width container, generous whitespace |

## 11. Accessibility

- WCAG 2.1 AA target
- Semantic HTML5 elements (nav, main, article, section, footer)
- Single `<h1>` per page, proper heading hierarchy
- All interactive elements keyboard accessible with visible focus rings
- Phosphor icons with `aria-label` on icon-only buttons
- Color contrast 4.5:1 minimum for body text, 3:1 for large text
- `prefers-reduced-motion` honored on all animations
- Form inputs with associated `<label>` elements
- Skip-to-main-content link

## 12. SEO

- Proper `<title>` and `<meta description>` per page via Next.js Metadata API
- Open Graph + Twitter Card meta tags
- `robots.txt` and `sitemap.xml` generated
- Structured data (JSON-LD) for Person schema
- Canonical URLs
- `/admin/*` excluded from sitemap and indexed with `noindex`

## 13. Development Phases

### Phase 1 — Foundation & Core Portfolio
- Next.js project setup (App Router, TypeScript, Tailwind v4)
- shadcn/ui setup + theme configuration (light/dark)
- Supabase project + database schema + RLS policies
- Cloudinary account + upload utility
- Navbar + Footer components
- Home page (Hero, Featured Projects, About preview, Skills, Footer CTA)
- Projects page (grid + filter)
- Project Detail page
- Contact page + form → Supabase + Cloudflare Turnstile spam protection
- Page transitions (Motion AnimatePresence)
- Scroll animations (Motion whileInView)
- Responsive across all breakpoints

### Phase 2 — Admin Dashboard Core
- Supabase Auth setup (email/password)
- Admin layout (sidebar + header)
- Auth middleware (protect `/admin/*`)
- Projects CRUD (list, create, edit, delete + Cloudinary image upload)
- Messages inbox (list, read/unread, delete)
- About editor
- Skills manager (CRUD + reorder)
- Experience manager (CRUD + reorder)
- Site Settings (social links, SEO defaults, CV upload)

### Phase 3 — Blog & Testimonials
- Tiptap rich text editor integration
- Blog CRUD in admin
- Blog listing page (public)
- Blog post page (public)
- Testimonials CRUD in admin
- Testimonials section on homepage

### Phase 4 — Polish & Production
- SEO optimization (metadata, sitemap, structured data, OG images)
- Performance audit (Lighthouse, bundle size)
- Full accessibility audit
- Advanced GSAP scroll animations (if cinematic sections needed)
- Error boundaries and loading states
- 404 page
- Final responsive QA across all breakpoints
- Production deployment on Vercel

## 14. Anti-Patterns to Avoid

- No AI-purple gradients
- No centered hero (split-screen instead, DESIGN_VARIANCE 7)
- No emoji as icons (Phosphor duotone only)
- No fake project data presented as real
- No lucide-react (Phosphor is the icon family)
- No placeholder copy that ships to production
- No `h-screen` (use `min-h-[100dvh]`)
- No `window.addEventListener("scroll")` (use Motion/GSAP)
- No `useState` for continuous values (use `useMotionValue`)
- No more than 1 marquee per page
- No eyebrow on every section (max 1 per 3 sections)

## 15. Open Questions

| Question | Impact | Blocking |
|---|---|---|
| Custom domain? (e.g., hafizhrizqullah.com) | Affects Vercel deployment config | No — can add later |
| Photo for hero section? | Affects hero layout | No — placeholder for now |
| Specific testimonials to pre-fill? | Affects testimonials section | No — admin can add later |
| ~~GSAP license for commercial use?~~ | ~~GSAP has a custom license~~ | **CLOSED** — free since Apr 2025 |
| ~~ERP Dashboard NDA~~ | ~~Confidentiality risk~~ | **CLOSED** — swapped to Mawmaw Interior |
