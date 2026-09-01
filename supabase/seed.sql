-- Ensure proficiency and project link columns exist in case remote schema is outdated
ALTER TABLE IF EXISTS skills ADD COLUMN IF NOT EXISTS proficiency INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS demo_url TEXT;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Clear existing data
TRUNCATE TABLE about, experiences, skills, projects, site_settings RESTART IDENTITY CASCADE;

-- 1. About
INSERT INTO about (bio, philosophy, hobbies, photo_url) VALUES (
  'PMO, UI/UX Designer, and Web Developer based in Indonesia. I manage projects, design interfaces, and write code. I''ve shipped government-adjacent systems, fintech interfaces, and startup products across the full project lifecycle. Graduated with a Bachelor of Informatics from Gunadarma University (GPA 3.54/4.00), where my thesis focused on user interface analysis and design for mobile banking using User-Centered Design and A/B Testing.',
  'Building products from the ground up: strategy, design, and code.',
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
),
(
  'Ministry of Education, Culture, Research and Technology',
  'Computer Operator / IT Consultant',
  'Documented and inventoried Indonesian cultural treasures across 451 museums nationwide. Managed a digital asset repository containing over 100,395 multimedia items, optimizing data retrieval for cultural heritage websites. Cataloged 30,930 registered objects, buildings, sites, structures, and areas.',
  '2023-03-01',
  '2023-04-30',
  FALSE,
  2
),
(
  'Gunadarma University',
  'Bachelor of Informatics',
  'Focused on software engineering, database management, and human-computer interaction. Thesis: Analysis and Design of BCA Mobile Banking User Interface using User-Centered Design (UCD) and A/B Testing Methodology. Graduated with GPA 3.54/4.00.',
  '2018-09-01',
  '2022-10-31',
  FALSE,
  3
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
('SQL', 'backend', 85, 10),
('MySQL', 'backend', 85, 11),
('PostgreSQL', 'backend', 80, 12),
('Figma', 'design', 85, 13),
('UI/UX Design', 'design', 85, 14),
('UCD & A/B Testing', 'design', 80, 15),
('Git & GitHub', 'tools', 90, 16),
('Grafana', 'tools', 80, 17),
('Jira / Project Tracking', 'tools', 85, 18);

-- 4. Projects (Curated GitHub Repos & Case Studies)
INSERT INTO projects (slug, title, description, role, category, tech_stack, github_url, demo_url, featured, sort_order, status) VALUES 
(
  'voltune',
  'Voltune',
  'A state-aware Windows performance, maintenance, network diagnostics, and system recovery toolkit built with Python and native Windows APIs.',
  'Creator & Lead Developer',
  'tools',
  ARRAY['Python', 'Windows API', 'System Optimization', 'PowerShell'],
  'https://github.com/rzqllh/Voltune',
  NULL,
  TRUE,
  1,
  'published'
),
(
  'forma',
  'Forma',
  'Privacy-first visual finishing workspace for designers. Clean image metadata, apply custom watermarks, resize, and export assets client-side without re-exporting from design tools.',
  'Creator & Frontend Developer',
  'tools',
  ARRAY['TypeScript', 'React', 'Canvas API', 'Tailwind CSS'],
  'https://github.com/rzqllh/Forma',
  NULL,
  TRUE,
  2,
  'published'
),
(
  'lumina',
  'Lumina',
  'Production tracking and shot management workspace for video and photography teams. Streamlines client deliverables, asset review cycles, and project milestones.',
  'Full-Stack Developer',
  'web-dev',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  'https://github.com/rzqllh/Lumina',
  'https://lumina-azure-beta.vercel.app',
  TRUE,
  3,
  'published'
),
(
  'yomirra',
  'Yomirra',
  'High-performance web reader application for digital manga and webtoons with multi-source adapters, adaptive image loading, and offline caching support.',
  'Frontend Architect',
  'web-dev',
  ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  'https://github.com/rzqllh/Yomirra',
  'https://yomirra.vercel.app',
  TRUE,
  4,
  'published'
),
(
  'mawmaw-interior',
  'Mawmaw Interior Studio',
  'Editorial showcase and spatial portfolio for an interior design studio, featuring dynamic typography, curated project galleries, and responsive architectural layouts.',
  'Frontend Developer & Designer',
  'web-dev',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/rzqllh/Mawmaw-landing',
  'https://mawmaw-interior.vercel.app',
  TRUE,
  5,
  'published'
),
(
  'hadzkashop-pos',
  'HadzkaShop Point of Sale',
  'Full-stack retail Point of Sale and inventory tracking application with barcode scanning integration, daily sales reconciliation, and transaction receipts.',
  'Full-Stack Developer',
  'web-dev',
  ARRAY['React', 'Node.js', 'Tailwind CSS', 'REST API'],
  'https://github.com/rzqllh/HadzkaShop_PoS',
  NULL,
  TRUE,
  6,
  'published'
),
(
  'cultural-heritage-repository',
  'Cultural Heritage Digital Asset Repository',
  'Managed and structured an asset repository of 100,395+ multimedia items across 451 museums nationwide for the Ministry of Education & Culture, optimizing metadata indexing and query retrieval.',
  'Computer Operator / IT Consultant',
  'web-dev',
  ARRAY['PHP', 'MySQL', 'SQL Architecture', 'Data Cataloging'],
  NULL,
  NULL,
  FALSE,
  7,
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
  8,
  'published'
);

-- 5. Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"site_title": "Hafizh Rizqullah Prasetya", "tagline": "PMO · Designer · Developer"}'),
  ('social',  '{"github": "https://github.com/rzqllh", "linkedin": "https://linkedin.com/in/rzqllh", "twitter": "", "email": "hrizqullah484@gmail.com"}'),
  ('seo',     '{"meta_description": "Hafizh Rizqullah Prasetya. PMO, UI/UX Designer, and Web Developer based in Indonesia.", "og_image": ""}'),
  ('cv',      '{"url": "/Hafizh Rizqullah Prasetya - CV.pdf"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
