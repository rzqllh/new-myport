-- Ensure proficiency and project link columns exist in case remote schema is outdated
ALTER TABLE IF EXISTS skills ADD COLUMN IF NOT EXISTS proficiency INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS demo_url TEXT;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Clear existing data
TRUNCATE TABLE about, experiences, skills, projects, site_settings RESTART IDENTITY CASCADE;

-- 1. About
INSERT INTO about (bio, philosophy, hobbies, photo_url) VALUES (
  'Project Management Officer (IT & Strategy) at Telkom Indonesia and a Bachelor of Informatics graduate from Gunadarma University (GPA 3.54/4.00). I plan products, design their interfaces, and build them myself when the timeline calls for it -- coordinating IT projects and monitoring infrastructure health at Telkom, and shipping full-stack products end to end on the side. Thesis: UI analysis and design for mobile banking using User-Centered Design and A/B Testing.',
  'Plan it, design it, build it -- end to end, not just one slice of the stack.',
  'Technology, UI/UX Research, Open Source',
  ''
);

-- 2. Experiences
INSERT INTO experiences (company, role, description, start_date, end_date, is_current, sort_order) VALUES 
(
  'Telkom Indonesia',
  'Project Management Officer (IT & Strategy)',
  'Supported IT project coordination and tracking across multiple teams, ensuring alignment with project timelines and deliverables. Monitored project progress, identified bottlenecks, and assisted in resolving workflow issues. Monitored daily device health and system performance utilizing Grafana, ensuring optimal infrastructure reliability and proactive issue resolution.',
  '2024-03-01',
  NULL,
  TRUE,
  1
);

-- 3. Skills
INSERT INTO skills (name, category, proficiency, sort_order) VALUES 
('React', 'frontend', 85, 1),
('Next.js', 'frontend', 85, 2),
('TypeScript', 'frontend', 80, 3),
('JavaScript', 'frontend', 90, 4),
('Tailwind CSS', 'frontend', 90, 5),
('HTML/CSS', 'frontend', 95, 6),
('shadcn/ui & Radix UI', 'frontend', 80, 7),
('Node.js', 'backend', 75, 8),
('Python', 'backend', 70, 9),
('PHP', 'backend', 75, 10),
('SQL', 'backend', 85, 11),
('PostgreSQL', 'backend', 80, 12),
('MySQL', 'backend', 85, 13),
('Prisma', 'backend', 75, 14),
('Supabase', 'backend', 80, 15),
('Figma', 'design', 85, 16),
('UI/UX Design', 'design', 85, 17),
('UCD & A/B Testing', 'design', 80, 18),
('Git & GitHub', 'tools', 90, 19),
('Grafana', 'tools', 80, 20),
('Jira / Project Tracking', 'tools', 85, 21);

-- 4. Projects
INSERT INTO projects (slug, title, description, role, category, tech_stack, github_url, demo_url, featured, sort_order, status) VALUES 
(
  'lumina',
  'Lumina',
  'Personal project operating system for photographers and videographers -- manages a project from deposit through preparation, production, delivery, and payment, with project finance tracking (value, receivable, projected profit), a structured brief builder, and public client status links.',
  'Full-Stack Developer',
  'web-dev',
  ARRAY['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS'],
  'https://github.com/rzqllh/Lumina',
  'https://lumina-azure-beta.vercel.app',
  TRUE,
  1,
  'published'
),
(
  'mawmaw-interior',
  'Mawmaw Interior Studio',
  'Public site and admin CMS for a premium interior design and furniture studio -- manages projects, articles, services, and site settings, with a client consultation flow and published portfolio content.',
  'Full-Stack Developer & Designer',
  'web-dev',
  ARRAY['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase Auth', 'Tailwind CSS'],
  'https://github.com/rzqllh/Mawmaw-landing',
  'https://mawmaw-interior.vercel.app',
  TRUE,
  2,
  'published'
),
(
  'summai',
  'SummAI',
  'Local-first meeting intelligence tool built for mixed Indonesian/English meetings -- transcribes audio with Groq Whisper and synthesizes structured summaries with Gemini. Bring-your-own-API-key, self-hostable, no hosted middleware or subscription.',
  'Full-Stack Developer',
  'web-dev',
  ARRAY['Next.js', 'FastAPI', 'SQLite', 'Groq Whisper', 'Google Gemini'],
  'https://github.com/rzqllh/SummAI',
  NULL,
  TRUE,
  3,
  'published'
),
(
  'rangkai',
  'Rangkai',
  'AI tool that interviews you to clarify a raw software idea, then generates a structured, execution-ready "Build Pack" for coding agents like Claude Code, Gemini Antigravity, and OpenAI Codex.',
  'Creator & Frontend Developer',
  'tools',
  ARRAY['TypeScript'],
  'https://github.com/rzqllh/Rangkai',
  NULL,
  TRUE,
  4,
  'published'
),
(
  'hadzkashop-pos',
  'HadzkaShop Point of Sale',
  'Full-stack retail Point of Sale system for a small shop -- dynamic product catalog, cash and QRIS (Midtrans) payments, an automatic stock-movement ledger, and role-based access for owner and cashier.',
  'Full-Stack Developer',
  'web-dev',
  ARRAY['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Midtrans', 'shadcn/ui'],
  'https://github.com/rzqllh/HadzkaShop_PoS',
  'https://hadzka-shop.vercel.app',
  FALSE,
  5,
  'published'
),
(
  'yomirra',
  'Yomirra',
  'Mobile-first Progressive Web App for manga, comics, and webtoons with multi-source search across several built-in adapters, a local library with reading history and collections, offline chapter downloads, and Firebase-backed cloud sync.',
  'Full-Stack Developer',
  'web-dev',
  ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Firebase'],
  'https://github.com/rzqllh/Yomirra',
  'https://yomirra.vercel.app',
  FALSE,
  6,
  'published'
),
(
  'forma',
  'Forma',
  'Privacy-first visual finishing workspace for designers, built initially around interior design workflows. Local-first browser processing to clean metadata, apply logo watermarks, resize/compress, batch process, and export finished assets without touching the original design.',
  'Creator & Frontend Developer',
  'tools',
  ARRAY['Next.js', 'TypeScript', 'Canvas API', 'Cloudflare D1', 'Tailwind CSS'],
  'https://github.com/rzqllh/Forma',
  NULL,
  FALSE,
  7,
  'published'
),
(
  'voltune',
  'Voltune',
  'A state-aware Windows performance, maintenance, network diagnostics, and recovery toolkit built as a Python CLI for Windows 11 -- safe by default, reversible by design, with verified mutations and audit logging for every session.',
  'Creator & Lead Developer',
  'tools',
  ARRAY['Python', 'PowerShell', 'Windows API'],
  'https://github.com/rzqllh/Voltune',
  NULL,
  FALSE,
  8,
  'published'
),
(
  'bca-mobile-ui-analysis',
  'BCA Mobile Banking UI Usability Research',
  'Comprehensive usability analysis and interface redesign for mobile banking using User-Centered Design (UCD) and quantitative A/B testing methodology to streamline transactions.',
  'UX Researcher & UI Designer',
  'ui-ux',
  ARRAY['Figma', 'User-Centered Design', 'A/B Testing', 'Usability Metrics'],
  NULL,
  NULL,
  FALSE,
  9,
  'published'
);

-- 5. Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"site_title": "Hafizh Rizqullah Prasetya", "tagline": "UI/UX Designer · Design Engineer · Project Manager"}'),
  ('social',  '{"github": "https://github.com/rzqllh", "linkedin": "https://www.linkedin.com/in/rzqllh18/", "twitter": "https://x.com/rzqllh18", "email": "hrizqullah484@gmail.com"}'),
  ('seo',     '{"meta_description": "Hafizh Rizqullah Prasetya -- UI/UX Designer, Design Engineer, and Project Manager based in Indonesia.", "og_image": ""}'),
  ('cv',      '{"url": "https://drive.google.com/file/d/1stzg1TlhScszdakuhONlX-VKT4AFGpkd/view"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;