-- ─────────────────────────────────────────────────────────────────────────────
-- Portfolio CMS — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- Spec: docs/superpowers/specs/2026-07-31-portfolio-design.md §8
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID      DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT      UNIQUE NOT NULL,
  title       TEXT      NOT NULL,
  description TEXT,
  role        TEXT,
  category    TEXT,
  tech_stack  TEXT[]    DEFAULT '{}',
  featured    BOOLEAN   DEFAULT FALSE,
  sort_order  INTEGER   DEFAULT 0,
  status      TEXT      DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Project Images ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_images (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID    REFERENCES projects(id) ON DELETE CASCADE,
  url         TEXT    NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER DEFAULT 0
);

-- ─── Blog Posts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT        UNIQUE NOT NULL,
  title        TEXT        NOT NULL,
  content      TEXT,
  excerpt      TEXT,
  tags         TEXT[]      DEFAULT '{}',
  status       TEXT        DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Experiences ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  company     TEXT    NOT NULL,
  role        TEXT    NOT NULL,
  description TEXT,
  start_date  DATE    NOT NULL,
  end_date    DATE,
  is_current  BOOLEAN DEFAULT FALSE,
  sort_order  INTEGER DEFAULT 0
);

-- ─── Skills ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT    NOT NULL,
  category    TEXT    NOT NULL CHECK (category IN ('frontend', 'backend', 'design', 'tools')),
  icon        TEXT,
  proficiency INTEGER DEFAULT 0 CHECK (proficiency BETWEEN 0 AND 100),
  sort_order  INTEGER DEFAULT 0
);

-- ─── Testimonials ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT    NOT NULL,
  role        TEXT,
  company     TEXT,
  quote       TEXT    NOT NULL,
  avatar_url  TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_visible  BOOLEAN DEFAULT TRUE
);

-- ─── Contact Messages ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  body       TEXT        NOT NULL,
  is_read    BOOLEAN     DEFAULT FALSE,
  is_spam    BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Site Settings (key-value store) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id    UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  key   TEXT  UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'
);

-- ─── About (single-row) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio         TEXT,
  philosophy  TEXT,
  hobbies     TEXT,
  photo_url   TEXT
);

-- ─── Seed default rows ────────────────────────────────────────────────────────
INSERT INTO about (bio, philosophy, hobbies, photo_url)
  VALUES ('', '', '', '')
  ON CONFLICT DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('general', '{"site_title": "Hafizh Rizqullah Prasetya", "tagline": "PMO · Designer · Developer"}'),
  ('social',  '{"github": "https://github.com/rzqllh", "linkedin": "", "twitter": "", "email": ""}'),
  ('seo',     '{"meta_description": "", "og_image": ""}'),
  ('cv',      '{"url": ""}')
  ON CONFLICT (key) DO NOTHING;

-- ─── Updated-at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences    ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE about          ENABLE ROW LEVEL SECURITY;

-- Public read policies (published content only)
CREATE POLICY "Public read published projects"
  ON projects FOR SELECT USING (status = 'published');

CREATE POLICY "Public read project images"
  ON project_images FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_images.project_id
        AND projects.status = 'published'
    )
  );

CREATE POLICY "Public read published blog posts"
  ON blog_posts FOR SELECT USING (status = 'published');

CREATE POLICY "Public read experiences"
  ON experiences FOR SELECT USING (true);

CREATE POLICY "Public read skills"
  ON skills FOR SELECT USING (true);

CREATE POLICY "Public read visible testimonials"
  ON testimonials FOR SELECT USING (is_visible = true);

CREATE POLICY "Public read site settings"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "Public read about"
  ON about FOR SELECT USING (true);

-- Public insert for contact form
CREATE POLICY "Public insert messages"
  ON messages FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access projects"
  ON projects FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access project_images"
  ON project_images FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access blog_posts"
  ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access experiences"
  ON experiences FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access skills"
  ON skills FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access testimonials"
  ON testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access messages"
  ON messages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access site_settings"
  ON site_settings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access about"
  ON about FOR ALL USING (auth.role() = 'authenticated');
