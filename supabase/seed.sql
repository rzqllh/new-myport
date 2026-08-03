-- Ensure proficiency column exists in case remote schema is outdated
ALTER TABLE IF EXISTS skills ADD COLUMN IF NOT EXISTS proficiency INTEGER DEFAULT 0;

-- Clear existing data
TRUNCATE TABLE about, experiences, skills, projects, site_settings RESTART IDENTITY CASCADE;

-- 1. About
INSERT INTO about (bio, philosophy, hobbies, photo_url) VALUES (
  'Results-driven IT graduate with hands-on experience building web-based systems, including dashboards, authentication flows, and data-driven applications. Experienced as a Project Management Officer at Telkom Indonesia, contributing to IT project coordination, progress tracking, and cross-functional alignment.',
  'Bridging the gap between technical execution and business strategy to deliver impactful products.',
  'Photography, Technology, UI/UX Research',
  ''
);

-- 2. Experiences
INSERT INTO experiences (company, role, description, start_date, end_date, is_current, sort_order) VALUES 
(
  'Telkom Indonesia',
  'Project Management Officer (IT & Strategy)',
  'Supported IT project coordination and tracking across multiple teams, ensuring alignment with project timelines and deliverables. Monitored project progress, identified bottlenecks, and assisted in resolving workflow issues. Facilitated communication between technical and non-technical stakeholders to maintain project clarity. Assisted in documentation, reporting, and task tracking for ongoing IT initiatives. Monitored daily device health and system performance utilizing Grafana, ensuring optimal infrastructure reliability and proactive issue resolution.',
  '2024-03-01',
  NULL,
  TRUE,
  1
),
(
  'Ministry of Education, Culture, Research and Technology',
  'Computer Operator',
  'Documented and inventoried Indonesian cultural treasures across 451 museums nationwide. Managed and architected a massive digital asset repository containing over 100,395 multimedia items, optimizing data retrieval for cultural heritage websites. Oversaw the management of cultural reserves, cataloging 30,930 registered objects, buildings, sites, structures, and areas. Acted as the primary IT consultant for museum website operations and digital asset management, ensuring 100% data accuracy and seamless system integration.',
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

-- 4. Projects (Inferred from CV)
INSERT INTO projects (slug, title, description, role, category, tech_stack, featured, sort_order, status) VALUES 
(
  'cultural-heritage-repository',
  'Cultural Heritage Digital Repository',
  'A massive digital asset repository containing over 100,395 multimedia items, optimizing data retrieval for Indonesian cultural heritage websites across 451 museums nationwide.',
  'Computer Operator / IT Consultant',
  'Web App',
  ARRAY['PHP', 'MySQL', 'JavaScript'],
  TRUE,
  1,
  'published'
),
(
  'bca-mobile-ui-analysis',
  'BCA Mobile Banking UI Redesign',
  'Analysis and Design of BCA Mobile Banking User Interface using User-Centered Design (UCD) and A/B Testing Methodology. Conducted comprehensive research to improve user experience and interface efficiency.',
  'UX Researcher',
  'UI/UX',
  ARRAY['Figma', 'A/B Testing', 'UCD'],
  TRUE,
  2,
  'published'
);

-- 5. Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"site_title": "Hafizh Rizqullah Prasetya", "tagline": "Project Management Officer — IT Project Coordination & Delivery"}'),
  ('social',  '{"github": "https://github.com/rzqllh", "linkedin": "https://linkedin.com/in/rzqllh", "twitter": "", "email": "hrizqullah484@gmail.com"}'),
  ('seo',     '{"meta_description": "Portfolio of Hafizh Rizqullah Prasetya, an IT Project Management Officer and Developer.", "og_image": ""}'),
  ('cv',      '{"url": "/Hafizh Rizqullah Prasetya - CV.pdf"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
