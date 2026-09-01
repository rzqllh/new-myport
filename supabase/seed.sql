-- Ensure proficiency column exists in case remote schema is outdated
ALTER TABLE IF EXISTS skills ADD COLUMN IF NOT EXISTS proficiency INTEGER DEFAULT 0;

-- Clear existing data
TRUNCATE TABLE about, experiences, skills, projects, site_settings RESTART IDENTITY CASCADE;

-- 1. About
INSERT INTO about (bio, philosophy, hobbies, photo_url) VALUES (
  'PMO · UI/UX Designer · Web Developer. Based in Indonesia, I manage projects, design interfaces, and write code. I''ve shipped everything from government-adjacent systems to fintech interfaces.',
  'I bridge the gap between business goals and technical reality.',
  'Photography, Technology, UI/UX Research',
  ''
);

-- 2. Experiences
INSERT INTO experiences (company, role, description, description_id, context, context_id, decision, decision_id, outcome, outcome_id, evidence_items, start_date, end_date, is_current, sort_order) VALUES
(
  'Telkom Indonesia',
  'Project Management Officer (IT & Strategy)',
  'IT project coordination, delivery tracking, stakeholder alignment, reporting, and infrastructure-health monitoring.',
  'Koordinasi proyek IT, pemantauan delivery, penyelarasan stakeholder, pelaporan, dan monitoring kesehatan infrastruktur.',
  'Multi-team IT initiatives depend on clear ownership, current delivery information, and communication that works for both technical and non-technical stakeholders.',
  'Inisiatif IT lintas tim membutuhkan ownership yang jelas, informasi delivery terbaru, serta komunikasi yang dipahami stakeholder teknis maupun nonteknis.',
  'Use a consistent reporting rhythm to keep deliverables, bottlenecks, follow-ups, and infrastructure signals visible to the people responsible for acting on them.',
  'Menggunakan ritme pelaporan yang konsisten agar deliverable, bottleneck, tindak lanjut, dan sinyal infrastruktur tetap terlihat oleh pihak yang perlu bertindak.',
  'More than two years coordinating IT delivery at Telkom Indonesia, including project documentation, cross-functional follow-up, and daily monitoring through Grafana.',
  'Lebih dari dua tahun mengoordinasikan delivery IT di Telkom Indonesia, termasuk dokumentasi proyek, tindak lanjut lintas fungsi, dan monitoring harian melalui Grafana.',
  '[{"kind":"redacted_excerpt","label":"Sanitized progress-report excerpt","label_id":"Cuplikan laporan progres tersensor","redacted":true,"status":"pending"}]'::jsonb,
  '2024-03-01',
  NULL,
  TRUE,
  1
),
(
  'Ministry of Education, Culture, Research and Technology',
  'Computer Operator',
  'National cultural-heritage data operations, digital-asset management, verification, and technical support.',
  'Operasional data warisan budaya nasional, pengelolaan aset digital, verifikasi, dan dukungan teknis.',
  'National cultural-heritage records combined museum inventories, multimedia assets, approval status, and website data that had to remain accurate and retrievable.',
  'Data warisan budaya nasional menggabungkan inventaris museum, aset multimedia, status penetapan, dan data website yang harus tetap akurat serta mudah ditelusuri.',
  'Apply a structured inventory and verification flow across museum, media, and heritage records, with documentation kept alongside each operational step.',
  'Menerapkan alur inventarisasi dan verifikasi terstruktur untuk data museum, media, dan cagar budaya, dengan dokumentasi pada setiap tahap operasional.',
  'The work covered 451 museums and more than 100,000 multimedia assets while supporting accurate cultural-heritage information and digital operations.',
  'Pekerjaan mencakup 451 museum dan lebih dari 100.000 aset multimedia sekaligus mendukung akurasi informasi warisan budaya dan operasional digital.',
  '[{"kind":"redacted_excerpt","label":"Sanitized data-structure excerpt","label_id":"Cuplikan struktur data tersensor","redacted":true,"status":"pending"}]'::jsonb,
  '2023-03-01',
  '2023-04-30',
  FALSE,
  2
);

-- 3. Skills
INSERT INTO skills (name, category, proficiency, sort_order) VALUES 
('React', 'frontend', 85, 1),
('Next.js', 'frontend', 85, 2),
('TypeScript', 'frontend', 80, 3),
('JavaScript', 'frontend', 90, 4),
('Tailwind CSS', 'frontend', 90, 5),
('HTML/CSS', 'frontend', 95, 6),
('Node.js', 'backend', 75, 7),
('Python', 'backend', 70, 8),
('PHP', 'backend', 75, 9),
('Java (Basic)', 'backend', 60, 10),
('SQL', 'backend', 85, 11),
('MySQL', 'backend', 85, 12),
('MongoDB', 'backend', 75, 13),
('Oracle', 'backend', 65, 14),
('Figma', 'design', 85, 15),
('UI/UX Design', 'design', 85, 16),
('Git/GitHub', 'tools', 90, 17);

-- 4. Featured project case files
INSERT INTO projects (slug, title, description, description_id, role, category, tech_stack, context, context_id, decision, decision_id, outcome, outcome_id, evidence_items, featured, sort_order, status) VALUES
(
  'opspilot',
  'OpsPilot',
  'A project-control workspace for dependencies, risks, decisions, and operational evidence.',
  'Workspace pengendalian proyek untuk dependensi, risiko, keputusan, dan bukti operasional.',
  'Product owner & developer',
  'Project control system',
  ARRAY['Next.js', 'TypeScript', 'Firestore', 'Zod'],
  'Project delivery becomes difficult to audit when dependencies, decisions, and supporting evidence live in separate tools and message threads.',
  'Delivery proyek sulit ditelusuri ketika dependensi, keputusan, dan bukti pendukung tersebar di banyak alat dan percakapan.',
  'Model project control as a traceable system: strict data contracts first, then service boundaries, timelines, and activity records that share one vocabulary.',
  'Memodelkan project control sebagai sistem yang dapat ditelusuri: mulai dari kontrak data yang ketat, lalu service boundary, timeline, dan activity record dengan bahasa yang sama.',
  'The current repository establishes the reliability baseline. Advanced AI and document generation remain explicitly out of scope for this phase.',
  'Repository saat ini membangun baseline reliability. AI lanjutan dan pembuatan dokumen masih berada di luar fase ini.',
  '[{"kind":"repository","label":"Source repository","label_id":"Repository sumber","url":"https://github.com/rzqllh/ProjectManagement-ERP-Dashboard","status":"available"}]'::jsonb,
  TRUE,
  1,
  'published'
),
(
  'rangkai',
  'Rangkai',
  'A planning engine that turns rough software ideas into structured, coding-agent-ready Build Packs.',
  'Planning engine yang mengubah ide software mentah menjadi Build Pack terstruktur dan siap dikerjakan coding agent.',
  'Product owner & developer',
  'Planning system',
  ARRAY['React', 'TypeScript', 'Hono', 'Cloudflare', 'Supabase'],
  'Coding agents can produce code quickly, but ambiguous inputs move unresolved product decisions into implementation, where they become rework.',
  'Coding agent dapat menghasilkan kode dengan cepat, tetapi input ambigu memindahkan keputusan produk yang belum selesai ke tahap implementasi dan akhirnya menjadi rework.',
  'Put a planning layer before execution: ask one high-leverage question at a time, track confirmed and assumed decisions separately, and compile one canonical Build Pack.',
  'Menempatkan planning layer sebelum eksekusi: menanyakan satu pertanyaan bernilai tinggi setiap kali, memisahkan keputusan confirmed dan assumed, lalu menyusun satu Build Pack kanonis.',
  'Rangkai has a working domain model for adaptive planning, provenance-aware decisions, blueprint compilation, and target-specific exports.',
  'Rangkai memiliki domain model untuk adaptive planning, decision provenance, kompilasi blueprint, dan export khusus.',
  '[{"kind":"repository","label":"Source repository","label_id":"Repository sumber","url":"https://github.com/rzqllh/Rangkai","status":"available"},{"kind":"redacted_excerpt","label":"Redacted Build Pack excerpt","label_id":"Cuplikan Build Pack tersensor","redacted":true,"status":"pending"}]'::jsonb,
  TRUE,
  2,
  'published'
),
(
  'summai',
  'SummAI',
  'Local-first meeting intelligence that turns recordings into structured notes and accountable next actions.',
  'Meeting intelligence local-first yang mengubah rekaman menjadi catatan terstruktur dan tindak lanjut yang jelas.',
  'Product owner & developer',
  'Meeting intelligence',
  ARRAY['Next.js', 'FastAPI', 'Python', 'Groq', 'Gemini'],
  'Meeting recordings preserve what was said, but they do not create a usable decision record, assigned actions, or a format teams can circulate.',
  'Rekaman meeting menyimpan percakapan, tetapi tidak otomatis menghasilkan catatan keputusan, action item, atau format yang siap diedarkan ke tim.',
  'Separate transcription from synthesis, keep meeting records local, and let the user choose a structured output matched to the meeting purpose.',
  'Memisahkan transkripsi dari sintesis, menyimpan data meeting secara lokal, dan memberi pengguna pilihan output terstruktur sesuai tujuan meeting.',
  'The application accepts recordings or raw transcripts, produces structured meeting outputs, and supports document export with local-first storage.',
  'Aplikasi menerima rekaman atau transkrip mentah, menghasilkan output meeting terstruktur, dan mendukung export dokumen dengan penyimpanan local-first.',
  '[{"kind":"repository","label":"Source repository","label_id":"Repository sumber","url":"https://github.com/rzqllh/SummAI","status":"available"}]'::jsonb,
  TRUE,
  3,
  'published'
);

-- 5. Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"site_title": "Hafizh Rizqullah Prasetya", "tagline": "Project Management Officer — IT Project Coordination & Delivery"}'),
  ('social',  '{"github": "https://github.com/rzqllh", "linkedin": "https://linkedin.com/in/rzqllh", "twitter": "", "email": "hrizqullah484@gmail.com"}'),
  ('seo',     '{"meta_description": "Portfolio of Hafizh Rizqullah Prasetya, an IT Project Management Officer and Developer.", "og_image": ""}'),
  ('cv',      '{"url": "/Hafizh Rizqullah Prasetya - CV.pdf"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
