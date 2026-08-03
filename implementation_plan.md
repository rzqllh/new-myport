# Hafizh Portfolio + CMS Admin Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a multi-page personal portfolio with a full CMS admin dashboard for Hafizh Rizqullah Prasetya — a PMO/Developer/Designer hybrid targeting startup hiring managers.

**Architecture:** Next.js 15 App Router with server components for the public portfolio, client components for interactive elements (animations, admin CRUD). Supabase for auth + database, Cloudinary for image storage, Vercel for hosting. Admin dashboard is a protected route group behind Supabase auth middleware.

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Phosphor Icons (duotone) · Motion (framer-motion) · GSAP + ScrollTrigger · Supabase · Cloudinary · Cloudflare Turnstile · Tiptap

**Design Spec:** [2026-07-31-portfolio-design.md](file:///c:/Users/Hafizh%20Rizqullah/Documents/Code/newProject/docs/superpowers/specs/2026-07-31-portfolio-design.md)

## Global Constraints

- **Free-first:** All services must use free tiers. No paid upgrades.
- **English-only:** No bilingual/i18n. Single-language DB columns.
- **No AI-generated mockups:** Project images are real WIP screenshots or minimized cards. No fake product representations.
- **Icons:** `@phosphor-icons/react` duotone only. No lucide-react, no emoji.
- **Animations:** Motion for React animations, GSAP only for scroll-pinned/scrubbed sections. All gated by `prefers-reduced-motion`.
- **shadcn/ui rules:** Semantic colors only (`bg-primary`, not `bg-blue-500`). `cn()` for conditional classes. No `space-x/y`, use `gap`. No manual `dark:` overrides.
- **Layout:** No `h-screen` (use `min-h-[100dvh]`). No `window.addEventListener("scroll")`. CSS Grid over flexbox math.
- **Typography:** Space Grotesk (display) + Archivo (body) + JetBrains Mono (code). Loaded via `next/font/google`.
- **Colors:** Cool slate neutrals + Electric Blue accent (`#2563EB` light / `#3B82F6` dark). No AI-purple.
- **Theme:** Light default, dark mode via shadcn theme toggle.
- **Viewport stability:** `min-h-[100dvh]` for hero, not `h-screen`.

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, theme provider, metadata
│   ├── page.tsx                      # Home page (server component)
│   ├── about/page.tsx                # About page
│   ├── projects/
│   │   ├── page.tsx                  # Projects grid
│   │   └── [slug]/page.tsx           # Project detail
│   ├── blog/
│   │   ├── page.tsx                  # Blog listing
│   │   └── [slug]/page.tsx           # Blog post
│   ├── contact/page.tsx              # Contact page
│   ├── not-found.tsx                 # 404 page
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout (sidebar + header)
│   │   ├── login/page.tsx            # Login page
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── projects/
│   │   │   ├── page.tsx              # Projects list
│   │   │   ├── new/page.tsx          # Create project
│   │   │   └── [id]/edit/page.tsx    # Edit project
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog posts list
│   │   │   ├── new/page.tsx          # Create blog post
│   │   │   └── [id]/edit/page.tsx    # Edit blog post
│   │   ├── about/page.tsx            # About editor
│   │   ├── skills/page.tsx           # Skills manager
│   │   ├── experience/page.tsx       # Experience manager
│   │   ├── testimonials/page.tsx     # Testimonials manager
│   │   ├── messages/page.tsx         # Contact messages inbox
│   │   └── settings/page.tsx         # Site settings
│   └── api/
│       └── contact/route.ts          # Contact form API (Turnstile verification)
├── components/
│   ├── ui/                           # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── navbar.tsx                # Public site navbar
│   │   ├── footer.tsx                # Public site footer
│   │   ├── admin-sidebar.tsx         # Admin sidebar navigation
│   │   ├── admin-header.tsx          # Admin header
│   │   └── page-transition.tsx       # AnimatePresence wrapper
│   ├── sections/
│   │   ├── hero.tsx                  # Home hero (split-screen)
│   │   ├── featured-projects.tsx     # Home featured projects grid
│   │   ├── about-preview.tsx         # Home about preview
│   │   ├── skills-section.tsx        # Home skills display
│   │   ├── testimonials-section.tsx  # Home testimonials
│   │   └── footer-cta.tsx            # Home footer CTA
│   ├── project-card.tsx              # Reusable project card
│   ├── blog-card.tsx                 # Reusable blog card
│   ├── contact-form.tsx              # Contact form with Turnstile
│   ├── theme-toggle.tsx              # Dark/light mode toggle
│   ├── scroll-reveal.tsx             # Motion whileInView wrapper
│   ├── image-upload.tsx              # Cloudinary upload widget (admin)
│   └── tiptap-editor.tsx             # Tiptap rich text editor (admin)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server Supabase client
│   │   ├── middleware.ts             # Auth middleware helper
│   │   └── types.ts                  # Generated DB types
│   ├── cloudinary.ts                 # Cloudinary upload helpers
│   ├── utils.ts                      # cn() + general utilities
│   └── constants.ts                  # Site metadata, social links, nav items
├── styles/
│   └── globals.css                   # Tailwind v4 imports + CSS variables + custom tokens
├── middleware.ts                      # Next.js middleware (admin auth protection)
└── types/
    └── index.ts                      # Shared TypeScript types
```

---

## Phase 1 — Foundation & Core Portfolio

### Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts` (via CLI)
- Create: `src/styles/globals.css`
- Create: `src/lib/utils.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx` (temporary "Hello World")

**Produces:**
- Running Next.js dev server at `localhost:3000`
- Tailwind v4 configured with CSS custom properties
- `cn()` utility from shadcn

- [x] **Step 1: Initialize Next.js project**

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
```

> **Note:** Run with `--help` first to verify flags. The `./` installs into the current directory.

- [x] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Expected: Server runs at `localhost:3000`, shows Next.js default page.

- [x] **Step 3: Install core dependencies**

```bash
npm install @phosphor-icons/react motion gsap @supabase/supabase-js @supabase/ssr cloudinary @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-code-block-lowlight
```

- [x] **Step 4: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Select: New York style, Slate base color, CSS variables enabled.

- [x] **Step 5: Configure fonts in root layout**

In `src/app/layout.tsx`, configure `next/font/google` for Space Grotesk, Archivo, and JetBrains Mono. Apply font CSS variables to the `<html>` element.

```tsx
import { Space_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});
```

- [x] **Step 6: Configure design tokens in globals.css**

Set CSS custom properties for the color palette from the spec (Section 5.C): `--background`, `--foreground`, `--accent`, `--muted`, `--card`, `--border`, `--destructive` for both light and dark modes using `@media (prefers-color-scheme)` and `.dark` class strategy.

- [x] **Step 7: Create constants file**

Create `src/lib/constants.ts` with site metadata (name, description, URL), social links (GitHub: rzqllh, LinkedIn, Twitter, email), and navigation items.

- [x] **Step 8: Verify fonts and theme render correctly**

```bash
npm run dev
```

Open `localhost:3000`, inspect in DevTools that font CSS variables are applied, and colors match the spec.

- [x] **Step 9: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js project with fonts, theme, and shadcn/ui"
```

---

### Task 2: Supabase Setup & Database Schema

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/types.ts`
- Create: `.env.local` (Supabase keys)
- Create: `supabase/migrations/001_initial_schema.sql`

**Produces:**
- `createBrowserClient()` — browser-side Supabase client
- `createServerClient()` — server-side Supabase client (for RSC/API routes)
- All 9 database tables with RLS policies

- [x] **Step 1: Create Supabase project**

Go to [supabase.com](https://supabase.com), create a free project. Copy the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

- [x] **Step 2: Create `.env.local`**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- [x] **Step 3: Write initial migration SQL**

Create `supabase/migrations/001_initial_schema.sql` with all 9 tables from spec Section 8:

```sql
-- Projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  role TEXT,
  category TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Images
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences
CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);

-- Skills
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'design', 'tools')),
  icon TEXT,
  proficiency INTEGER DEFAULT 0 CHECK (proficiency BETWEEN 0 AND 100),
  sort_order INTEGER DEFAULT 0
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE
);

-- Contact Messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_spam BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (key-value)
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'
);

-- About (single row)
CREATE TABLE about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT,
  philosophy TEXT,
  hobbies TEXT,
  photo_url TEXT
);

-- Insert default about row
INSERT INTO about (bio, philosophy, hobbies, photo_url) VALUES ('', '', '', '');

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"site_title": "Hafizh Rizqullah Prasetya", "tagline": "PMO · Designer · Developer"}'),
  ('social', '{"github": "https://github.com/rzqllh", "linkedin": "", "twitter": "", "email": ""}'),
  ('seo', '{"meta_description": "", "og_image": ""}'),
  ('cv', '{"url": ""}');
```

- [x] **Step 4: Run migration in Supabase SQL Editor**

Go to Supabase Dashboard → SQL Editor → paste and execute the migration.

- [x] **Step 5: Enable Row Level Security (RLS)**

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public read project images" ON project_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.status = 'published')
);
CREATE POLICY "Public read published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read visible testimonials" ON testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read about" ON about FOR SELECT USING (true);

-- Public insert for contact messages (anyone can submit)
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access project_images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access about" ON about FOR ALL USING (auth.role() = 'authenticated');
```

- [x] **Step 6: Create Supabase client utilities**

Create `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `src/lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
```

- [x] **Step 7: Generate TypeScript types from Supabase**

Create `src/lib/supabase/types.ts` with type definitions matching the schema above (Database, Tables, Enums types).

- [x] **Step 8: Verify Supabase connection**

Create a temporary test in `src/app/page.tsx` that fetches `site_settings` and logs it. Verify connection works in dev server.

- [x] **Step 9: Commit**

```bash
git add .
git commit -m "feat: setup Supabase schema, RLS policies, and client utilities"
```

---

### Task 3: Cloudinary Setup & Image Upload Utility

**Files:**
- Create: `src/lib/cloudinary.ts`
- Create: `src/components/image-upload.tsx`
- Modify: `.env.local` (add Cloudinary keys)

**Produces:**
- `uploadImage(file: File): Promise<{ url: string; publicId: string }>` — upload helper
- `<ImageUpload />` — client component with Cloudinary upload widget

- [x] **Step 1: Create Cloudinary account and get credentials**

Sign up at [cloudinary.com](https://cloudinary.com). Copy `CLOUD_NAME`, `API_KEY`, `API_SECRET`.

- [x] **Step 2: Add Cloudinary env vars**

Append to `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- [x] **Step 3: Create upload utility**

Create `src/lib/cloudinary.ts` with a function that generates signed upload params and a helper for constructing optimized image URLs with Cloudinary transformations.

- [x] **Step 4: Create ImageUpload component**

Create `src/components/image-upload.tsx` — a `"use client"` component using Cloudinary's unsigned upload widget (via their JS SDK loaded from CDN). On successful upload, it calls an `onUpload(url, publicId)` callback.

- [x] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add Cloudinary image upload utility and component"
```

---

### Task 4: Layout Components (Navbar + Footer + Page Transitions)

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/page-transition.tsx`
- Create: `src/components/theme-toggle.tsx`
- Create: `src/components/scroll-reveal.tsx`
- Modify: `src/app/layout.tsx` (add navbar, footer, theme provider, page transition)

**Produces:**
- `<Navbar />` — responsive nav with logo, links, theme toggle, mobile hamburger
- `<Footer />` — social links, copyright, quick nav
- `<PageTransition />` — Motion AnimatePresence wrapper for route transitions
- `<ThemeToggle />` — dark/light mode switch
- `<ScrollReveal />` — Motion whileInView wrapper for section entry animations

**Interfaces:**
- Consumes: `cn()` from `src/lib/utils.ts`, constants from `src/lib/constants.ts`
- Produces: Layout shell used by all pages

- [x] **Step 1: Install shadcn/ui components needed for layout**

```bash
npx shadcn@latest add button sheet separator
```

- [x] **Step 2: Create ThemeToggle component**

`src/components/theme-toggle.tsx` — `"use client"` component using `next-themes` (install it: `npm install next-themes`). Toggle between light/dark with Phosphor `Sun` and `Moon` duotone icons. Use Motion `layout` prop for smooth icon morph.

- [x] **Step 3: Create Navbar component**

`src/components/layout/navbar.tsx` — `"use client"` component. Floating navbar with `top-4 left-4 right-4` spacing (per ui-ux-pro-max rules). Max height 72px. Contains: logo/name, nav links (Home, About, Projects, Blog, Contact), ThemeToggle, mobile hamburger (shadcn Sheet).

- [x] **Step 4: Create Footer component**

`src/components/layout/footer.tsx` — Server component. Social links (Phosphor icons: GithubLogo, LinkedinLogo, TwitterLogo, Envelope), quick nav links, copyright with current year.

- [x] **Step 5: Create ScrollReveal wrapper**

`src/components/scroll-reveal.tsx` — `"use client"` component using Motion `whileInView`. Props: `children`, `delay` (default 0), `className`. Fade up + 24px Y translate, 600ms duration, spring easing. Honors `prefers-reduced-motion` via `useReducedMotion()`.

- [x] **Step 6: Create PageTransition wrapper**

`src/components/layout/page-transition.tsx` — `"use client"` component using Motion `AnimatePresence` + `motion.div`. Fade + slight Y translate (200ms) on route change.

- [x] **Step 7: Wire layout components into root layout**

Modify `src/app/layout.tsx` to include: ThemeProvider (next-themes), Navbar, PageTransition wrapper around `{children}`, Footer.

- [x] **Step 8: Verify layout renders correctly**

```bash
npm run dev
```

Check: floating navbar renders on single line, footer visible, theme toggle works (light/dark), mobile hamburger opens Sheet.

- [x] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add navbar, footer, theme toggle, scroll reveal, and page transitions"
```

---

### Task 5: Home Page — Hero + Featured Projects + About Preview + Skills + Footer CTA

**Files:**
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/sections/featured-projects.tsx`
- Create: `src/components/sections/about-preview.tsx`
- Create: `src/components/sections/skills-section.tsx`
- Create: `src/components/sections/footer-cta.tsx`
- Create: `src/components/project-card.tsx`
- Modify: `src/app/page.tsx`

**Produces:**
- Complete home page with 5 sections
- `<ProjectCard />` reusable component

**Interfaces:**
- Consumes: `createClient()` from `src/lib/supabase/server.ts`, `<ScrollReveal />`, layout components
- Produces: Home page server component that fetches featured projects, skills, about preview from Supabase

- [x] **Step 1: Create Hero section**

`src/components/sections/hero.tsx` — `"use client"` component (for Motion animations). Split-screen layout (left text, right visual placeholder). Left side: eyebrow "PMO · Designer · Developer" (small uppercase, tracking-wider), headline (Space Grotesk 700, `text-4xl md:text-5xl lg:text-6xl tracking-tighter`), subtext (max 20 words, Archivo, `text-muted-foreground`), 2 CTAs (Primary: "Let's Work Together" → /contact, Secondary: "View Projects" → /projects). Hero fits initial viewport using `min-h-[100dvh]` with max `pt-24`.

- [x] **Step 2: Create ProjectCard component**

`src/components/project-card.tsx` — Props: `title`, `description`, `category`, `techStack`, `slug`, `imageUrl` (optional). Card with image area (shows image if available, otherwise minimal card with title + description + tech tags). Hover: scale 1.02 + shadow lift (Motion spring). Link wraps entire card to `/projects/[slug]`.

- [x] **Step 3: Create FeaturedProjects section**

`src/components/sections/featured-projects.tsx` — Server component. Fetches featured projects from Supabase (`featured = true, status = 'published'`). Asymmetric grid: 1 large card + 2 stacked (CSS Grid, not 3 equal columns). Each card uses `<ProjectCard />`. ScrollReveal stagger on viewport entry.

- [x] **Step 4: Create AboutPreview section**

`src/components/sections/about-preview.tsx` — Server component. Fetches `about` table from Supabase. Left-aligned text block, `max-w-[65ch]`. Short bio paragraph + "Read More" link to /about. No eyebrow (already used in hero — eyebrow restraint rule).

- [x] **Step 5: Create SkillsSection**

`src/components/sections/skills-section.tsx` — Server component. Fetches skills from Supabase, grouped by category. Display as horizontal scroll-snap pills or compact tag cloud (NOT a boring bullet list). Each pill shows skill name + Phosphor icon.

- [x] **Step 6: Create FooterCTA section**

`src/components/sections/footer-cta.tsx` — Full-width section: headline "Have a project in mind?", primary CTA button → /contact, secondary link to download CV.

- [x] **Step 7: Assemble Home page**

Modify `src/app/page.tsx` to compose all sections in order: Hero → FeaturedProjects → AboutPreview → SkillsSection → FooterCTA. Each section wrapped in `<ScrollReveal>` with staggered delays.

- [x] **Step 8: Verify home page**

```bash
npm run dev
```

Check at 375px, 768px, 1024px, 1440px. Hero fits viewport, no horizontal scroll, sections animate on scroll entry, theme toggle works across all sections.

- [x] **Step 9: Commit**

```bash
git add .
git commit -m "feat: build complete home page with hero, projects, about, skills, and CTA"
```

---

### Task 6: Projects Page + Project Detail Page

**Files:**
- Create: `src/app/projects/page.tsx`
- Create: `src/app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `createClient()`, `<ProjectCard />`, `<ScrollReveal />`
- Produces: `/projects` (filterable grid) and `/projects/[slug]` (case study detail)

- [x] **Step 1: Create Projects grid page**

`src/app/projects/page.tsx` — Server component. Fetches all published projects from Supabase. Filter bar at top (category tags: "All", "Web Dev", "UI/UX", "Project Management"). CSS Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`. Each project uses `<ProjectCard />`. Filter is a client component that filters the pre-fetched list client-side.

- [x] **Step 2: Create Project Detail page**

`src/app/projects/[slug]/page.tsx` — Server component. Fetches single project by slug + its images. Sections: full-width hero image (if available), Overview, Role, Tech Stack (tags), Image Gallery (if images exist), Back to Projects link, Previous/Next project navigation.

- [x] **Step 3: Generate metadata for SEO**

Both pages export `generateMetadata()` for dynamic titles and descriptions.

- [x] **Step 4: Verify both pages**

Navigate to `/projects` and `/projects/test-slug`. Verify filter works, detail page renders, responsive across breakpoints.

- [x] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add projects grid and project detail pages"
```

---

### Task 7: About Page

**Files:**
- Create: `src/app/about/page.tsx`

- [x] **Step 1: Create About page**

Server component. Fetches `about` table + `experiences` table (ordered by `sort_order`) + education data. Sections: Full bio, experience timeline (vertical, alternating sides desktop, single column mobile), education section, philosophy/approach, hobbies/interests. Each section with `<ScrollReveal />`.

- [x] **Step 2: Verify and commit**

```bash
git add .
git commit -m "feat: add about page with experience timeline"
```

---

### Task 8: Contact Page + Form Submission + Turnstile

**Files:**
- Create: `src/app/contact/page.tsx`
- Create: `src/components/contact-form.tsx`
- Create: `src/app/api/contact/route.ts`
- Modify: `.env.local` (add Turnstile keys)

**Interfaces:**
- Consumes: `createClient()` (server), Turnstile widget
- Produces: `/contact` page, `POST /api/contact` endpoint

- [x] **Step 1: Get Cloudflare Turnstile keys**

Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add Site. Get site key and secret key.

Add to `.env.local`:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

- [x] **Step 2: Create ContactForm component**

`src/components/contact-form.tsx` — `"use client"` component. Split layout: left = form (name, email, subject, message inputs using shadcn Form components), right = social links + email + CV download button. Turnstile widget embedded below the form. On submit: POST to `/api/contact`.

- [x] **Step 3: Create contact API route**

`src/app/api/contact/route.ts` — Validates Turnstile token server-side (POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify`). On success: inserts message into Supabase `messages` table. Returns JSON response.

- [x] **Step 4: Create Contact page**

`src/app/contact/page.tsx` — Server component wrapper around `<ContactForm />`. SEO metadata.

- [x] **Step 5: Test form submission**

Submit a test message. Verify: Turnstile widget appears, message lands in Supabase `messages` table, success toast shows.

- [x] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add contact page with Turnstile spam protection"
```

---

### Task 9: 404 Page + Responsive QA + Phase 1 Polish

**Files:**
- Create: `src/app/not-found.tsx`

- [x] **Step 1: Create 404 page**

Simple, on-brand 404 page with a headline, brief message, and link back to home.

- [x] **Step 2: Full responsive QA**

Test all pages at: 375px, 768px, 1024px, 1440px. Check:
- No horizontal scroll
- Navbar single line on desktop, hamburger on mobile
- Hero fits viewport
- Cards collapse to single column on mobile
- Touch targets ≥ 44px
- Theme toggle works everywhere

- [x] **Step 3: Accessibility check**

- Tab through all pages — focus rings visible
- Heading hierarchy (single h1 per page)
- All interactive elements keyboard accessible
- Form labels associated with inputs

- [x] **Step 4: Commit Phase 1 complete**

```bash
git add .
git commit -m "feat: complete Phase 1 — portfolio frontend with all public pages"
```

---

## Phase 2 — Admin Dashboard Core

### Task 10: Admin Auth (Supabase Login + Middleware)

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/components/layout/admin-sidebar.tsx`
- Create: `src/components/layout/admin-header.tsx`

**Produces:**
- Protected `/admin/*` routes (redirect to login if unauthenticated)
- Login page with Supabase email/password auth
- Admin layout shell with sidebar + header

- [x] **Step 1: Create admin user in Supabase**

Go to Supabase Dashboard → Authentication → Users → Invite User with your email. Set a password.

- [x] **Step 2: Create Next.js middleware**

`src/middleware.ts` — uses `@supabase/ssr` to check auth on every `/admin/*` route (except `/admin/login`). Redirects unauthenticated users to `/admin/login`.

- [x] **Step 3: Create Login page**

`src/app/admin/login/page.tsx` — `"use client"`. Email + password form using shadcn Input + Button. On submit: `supabase.auth.signInWithPassword()`. On success: redirect to `/admin`. On error: show error message.

- [x] **Step 4: Create Admin Sidebar**

`src/components/layout/admin-sidebar.tsx` — `"use client"`. Navigation links with Phosphor icons: Dashboard, Projects, Blog, About, Skills, Experience, Testimonials, Messages, Settings. Active link highlighted. Collapsible on tablet.

- [x] **Step 5: Create Admin Header**

`src/components/layout/admin-header.tsx` — Shows current page title, theme toggle, logout button.

- [x] **Step 6: Create Admin Layout**

`src/app/admin/layout.tsx` — Sidebar + Header + main content area. Does NOT include the public navbar/footer.

- [x] **Step 7: Create Admin Dashboard overview page**

`src/app/admin/page.tsx` — Server component. Fetches counts: total projects, published projects, total blog posts, unread messages. Displays as stat cards.

- [x] **Step 8: Verify auth flow**

Login → see dashboard. Logout → redirected to login. Direct URL to `/admin/projects` while logged out → redirected to login.

- [x] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add admin auth, layout, sidebar, and dashboard overview"
```

---

### Task 11: Projects CRUD (Admin)

**Files:**
- Create: `src/app/admin/projects/page.tsx`
- Create: `src/app/admin/projects/new/page.tsx`
- Create: `src/app/admin/projects/[id]/edit/page.tsx`

- [x] **Step 1: Install shadcn/ui components for admin**

```bash
npx shadcn@latest add table dialog alert-dialog input textarea select badge toast tabs card
```

- [x] **Step 2: Create Projects list page**

Data table with columns: title, category, status (badge), featured (toggle), actions (edit, delete). Delete uses AlertDialog for confirmation. Uses shadcn Table component.

- [x] **Step 3: Create Project form (shared between new and edit)**

Form with: title, slug (auto-generated from title), description (Tiptap editor), role, category (select), tech_stack (multi-tag input), featured (toggle), status (draft/published), image upload (Cloudinary widget for multiple images with sort order).

- [x] **Step 4: Create New Project page**

Uses the shared form. On submit: insert into Supabase `projects` + `project_images` tables. Redirect to `/admin/projects`.

- [x] **Step 5: Create Edit Project page**

Fetches existing project by ID. Pre-fills the shared form. On submit: update in Supabase. Redirect to `/admin/projects`.

- [x] **Step 6: Verify CRUD**

Create a test project, edit it, delete it. Check that public `/projects` page shows published projects only.

- [x] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add projects CRUD in admin dashboard"
```

---

### Task 12: Messages Inbox + About/Skills/Experience/Settings CRUD

**Files:**
- Create: `src/app/admin/messages/page.tsx`
- Create: `src/app/admin/about/page.tsx`
- Create: `src/app/admin/skills/page.tsx`
- Create: `src/app/admin/experience/page.tsx`
- Create: `src/app/admin/settings/page.tsx`

- [x] **Step 1: Messages inbox**

List of contact form submissions. Columns: name, email, subject, date, read/unread (badge). Click to expand message body. Mark as read/unread. Delete with confirmation.

- [x] **Step 2: About editor**

Single-form page: bio (Tiptap), philosophy (Tiptap), hobbies (textarea), photo upload (Cloudinary). Fetches and updates the single row in `about` table.

- [x] **Step 3: Skills manager**

List with drag-to-reorder (or manual sort_order input). Add/edit dialog: name, category (select), icon (text input for Phosphor icon name), proficiency (slider 0-100). Delete with confirmation.

- [x] **Step 4: Experience manager**

List ordered by start_date desc. Add/edit dialog: company, role, description (textarea), start_date, end_date (or "is_current" toggle). Delete with confirmation.

- [x] **Step 5: Site Settings**

Tabbed form: General (site title, tagline), Social Links (GitHub, LinkedIn, Twitter, email URLs), SEO (meta description, OG image upload), CV (PDF upload to Cloudinary). Reads/writes `site_settings` table key-value pairs.

- [x] **Step 6: Verify all admin pages**

Walk through every admin page. Create, edit, delete entries. Verify public pages reflect admin changes.

- [x] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add messages, about, skills, experience, and settings admin pages"
```

---

## Phase 3 — Blog & Testimonials

### Task 13: Tiptap Rich Text Editor Component

**Files:**
- Create: `src/components/tiptap-editor.tsx`

- [x] **Step 1: Create Tiptap editor component**

`"use client"` component. Props: `content` (initial HTML string), `onChange(html: string)`. Toolbar with: bold, italic, heading levels (H2, H3), bullet list, ordered list, code block (with syntax highlighting), link, image (Cloudinary upload), blockquote. Uses shadcn ToggleGroup for toolbar buttons.

- [x] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Tiptap rich text editor component"
```

---

### Task 14: Blog CRUD (Admin) + Public Blog Pages

**Files:**
- Create: `src/app/admin/blog/page.tsx`
- Create: `src/app/admin/blog/new/page.tsx`
- Create: `src/app/admin/blog/[id]/edit/page.tsx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/components/blog-card.tsx`

- [x] **Step 1: Blog CRUD admin pages**

Same pattern as Projects CRUD. Form: title, slug, excerpt, content (Tiptap editor), tags (multi-tag input), status, published_at (date picker).

- [x] **Step 2: Blog listing page (public)**

`src/app/blog/page.tsx` — Server component. Fetches published blog posts ordered by `published_at` desc. Cards showing: title, excerpt, date, tags, estimated read time (word count / 200). Uses `<BlogCard />`.

- [x] **Step 3: Blog post page (public)**

`src/app/blog/[slug]/page.tsx` — Server component. Renders HTML content from Tiptap with proper styling (`prose` classes). Shows title, date, tags, read time. Back to blog link.

- [x] **Step 4: Verify blog flow**

Create a blog post in admin → publish → verify it appears on `/blog` and `/blog/[slug]`.

- [x] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add blog CRUD and public blog pages"
```

---

### Task 15: Testimonials CRUD + Homepage Section

**Files:**
- Create: `src/app/admin/testimonials/page.tsx`
- Create: `src/components/sections/testimonials-section.tsx`
- Modify: `src/app/page.tsx` (add testimonials section)

- [x] **Step 1: Testimonials admin page**

CRUD list. Add/edit dialog: name, role, company, quote (max 3 lines enforced), avatar upload (Cloudinary), is_visible toggle, sort_order.

- [x] **Step 2: Testimonials section on homepage**

`src/components/sections/testimonials-section.tsx` — Server component. Fetches visible testimonials. Displays as a single rotating quote with name + role + company attribution. Uses typographic quotes (" "). Only rendered if testimonials exist in DB.

- [x] **Step 3: Add to homepage**

Insert `<TestimonialsSection />` between SkillsSection and FooterCTA in `src/app/page.tsx`.

- [x] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add testimonials CRUD and homepage section"
```

---

## Phase 4 — Polish & Production

### Task 16: SEO + Sitemap + Structured Data

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (add JSON-LD structured data)
- Modify: all page files (add `generateMetadata()` where missing)

- [x] **Step 1: Create dynamic sitemap**

`src/app/sitemap.ts` — Fetches all published projects and blog posts from Supabase, generates sitemap entries. Excludes `/admin/*`.

- [x] **Step 2: Create robots.txt**

`src/app/robots.ts` — Allows all crawlers. Disallows `/admin/*`. Points to sitemap.

- [x] **Step 3: Add JSON-LD structured data**

Person schema in root layout with name, jobTitle, url, sameAs (social links).

- [x] **Step 4: Verify all pages have metadata**

Check every page exports `generateMetadata()` with unique title and description. Verify OG tags render (use [opengraph.xyz](https://opengraph.xyz)).

- [x] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add SEO sitemap, robots.txt, and structured data"
```

---

### Task 17: Performance + Accessibility Audit + Final QA

- [x] **Step 1: Run Lighthouse audit**

```bash
npm run build
npx serve out
```

Run Lighthouse on: Home, About, Projects, Blog, Contact. Target: Performance > 90, Accessibility > 95, SEO > 95.

- [x] **Step 2: Fix any Lighthouse issues**

Common fixes: image optimization (Next.js Image component), unused CSS, font loading, contrast.

- [x] **Step 3: Full accessibility pass**

- Skip-to-main-content link
- Tab order on every page
- Screen reader test (NVDA or VoiceOver) on key flows
- `prefers-reduced-motion` disables all animations
- Color contrast check (all text 4.5:1 minimum)

- [x] **Step 4: Final responsive QA**

All pages at: 360px, 390px, 768px, 1280px, 1440px+. Check:
- No horizontal overflow
- No content behind fixed navbar
- Touch targets ≥ 44px
- Images don't break layout

- [x] **Step 5: Commit**

```bash
git add .
git commit -m "chore: performance and accessibility audit fixes"
```

---

### Task 18: Production Deployment

- [x] **Step 1: Connect to Vercel**

Push to GitHub. Connect repo to Vercel. Set environment variables in Vercel dashboard (copy from `.env.local`, remove `NEXT_PUBLIC_` prefix where needed).

- [x] **Step 2: Verify production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [x] **Step 3: Deploy**

Push to `main` branch. Vercel auto-deploys. Verify all pages work on the production URL.

- [x] **Step 4: Post-deploy smoke test**

- All public pages load
- Contact form submits successfully
- Admin login works
- Admin CRUD operations work
- Theme toggle works
- Responsive on real mobile device

- [x] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: production deployment configuration"
```

---

## Verification Summary

| Phase | Verification |
|---|---|
| Phase 1 | `npm run dev` — all public pages render, responsive at 4 breakpoints, animations work, theme toggle works |
| Phase 2 | Auth flow (login/logout/redirect), all admin CRUD operations, data shows on public pages |
| Phase 3 | Blog create → publish → visible on public page, testimonials CRUD → shows on homepage |
| Phase 4 | Lighthouse > 90/95/95, accessibility audit pass, production deploy + smoke test |

## Seed Data Reminder

After Phase 2 is complete, seed the database with Hafizh's real data:
- **3 projects:** Mawmaw Interior, HadzkaShop POS, Yomirra (with real descriptions, tech stacks, roles)
- **Skills:** From CV — React, Next.js, TypeScript, Tailwind, Figma, etc.
- **Experience:** From CV — Telkom Indonesia (PMO), Ministry of Education (Computer Operator)
- **About:** From CV/GitHub — bio, philosophy, hobbies
- **Site Settings:** Social links, email, CV upload
