-- Portfolio content model v2
-- Additive migration: legacy tables remain intact until the public/admin cutover is verified.

-- ─── Contacts compatibility ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

INSERT INTO contacts (id, name, email, subject, message, status, created_at)
SELECT
  id,
  name,
  email,
  subject,
  body,
  CASE
    WHEN is_spam THEN 'spam'
    WHEN is_read THEN 'read'
    ELSE 'new'
  END,
  created_at
FROM messages
ON CONFLICT (id) DO NOTHING;

-- ─── Explicit admin authorization with safe bootstrap ────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE portfolio_admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1
        FROM public.portfolio_admins
        WHERE user_id = auth.uid()
      )
      OR (
        NOT EXISTS (SELECT 1 FROM public.portfolio_admins)
        AND auth.role() = 'authenticated'
      )
    );
$$;

DROP POLICY IF EXISTS "Portfolio admins read admin list" ON portfolio_admins;
CREATE POLICY "Portfolio admins read admin list"
  ON portfolio_admins FOR SELECT
  USING (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Bootstrap first portfolio admin" ON portfolio_admins;
CREATE POLICY "Bootstrap first portfolio admin"
  ON portfolio_admins FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (
      NOT EXISTS (SELECT 1 FROM portfolio_admins)
      OR public.is_portfolio_admin()
    )
  );

DROP POLICY IF EXISTS "Portfolio admins manage admin list" ON portfolio_admins;
CREATE POLICY "Portfolio admins manage admin list"
  ON portfolio_admins FOR UPDATE
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Portfolio admins delete admin list" ON portfolio_admins;
CREATE POLICY "Portfolio admins delete admin list"
  ON portfolio_admins FOR DELETE
  USING (public.is_portfolio_admin());

-- Replace the legacy "any authenticated user" write policies without locking
-- out the existing owner before the first portfolio_admins row is claimed.
DROP POLICY IF EXISTS "Admin full access projects" ON projects;
CREATE POLICY "Portfolio admin full access projects"
  ON projects FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access project_images" ON project_images;
CREATE POLICY "Portfolio admin full access project_images"
  ON project_images FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access blog_posts" ON blog_posts;
CREATE POLICY "Portfolio admin full access blog_posts"
  ON blog_posts FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access experiences" ON experiences;
CREATE POLICY "Portfolio admin full access experiences"
  ON experiences FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access skills" ON skills;
CREATE POLICY "Portfolio admin full access skills"
  ON skills FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access testimonials" ON testimonials;
CREATE POLICY "Portfolio admin full access testimonials"
  ON testimonials FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access messages" ON messages;
CREATE POLICY "Portfolio admin full access messages"
  ON messages FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access site_settings" ON site_settings;
CREATE POLICY "Portfolio admin full access site_settings"
  ON site_settings FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin full access about" ON about;
CREATE POLICY "Portfolio admin full access about"
  ON about FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Public insert contacts" ON contacts;
CREATE POLICY "Public insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (status = 'new');

DROP POLICY IF EXISTS "Portfolio admin full access contacts" ON contacts;
CREATE POLICY "Portfolio admin full access contacts"
  ON contacts FOR ALL
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

-- ─── Media ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT,
  provider_id TEXT,
  url TEXT UNIQUE NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'document', 'video', 'other')),
  width INTEGER,
  height INTEGER,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_translations (
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  alt_text TEXT,
  caption TEXT,
  PRIMARY KEY (media_id, locale)
);

-- ─── Work ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS work_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted')),
  discipline TEXT NOT NULL DEFAULT 'engineering'
    CHECK (discipline IN ('project-management', 'product', 'engineering', 'research-design')),
  work_type TEXT NOT NULL DEFAULT 'case-study'
    CHECK (work_type IN ('case-study', 'product', 'tool', 'research', 'system')),
  timeframe_start DATE,
  timeframe_end DATE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  live_url TEXT,
  repository_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_translations (
  work_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  title TEXT NOT NULL,
  short_title TEXT,
  summary TEXT,
  role TEXT,
  context TEXT,
  challenge TEXT,
  approach TEXT,
  decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
  outcome TEXT,
  lessons TEXT,
  seo_title TEXT,
  seo_description TEXT,
  PRIMARY KEY (work_id, locale)
);

CREATE TABLE IF NOT EXISTS work_media (
  work_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'gallery'
    CHECK (role IN ('cover', 'hero', 'gallery', 'evidence', 'diagram', 'other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (work_id, media_id, role)
);

CREATE TABLE IF NOT EXISTS work_evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id UUID NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL DEFAULT 'other'
    CHECK (evidence_type IN ('screenshot', 'architecture', 'repository', 'deployment', 'document-excerpt', 'research', 'metric-source', 'other')),
  media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  source_url TEXT,
  source_date DATE,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_evidence_translations (
  evidence_id UUID NOT NULL REFERENCES work_evidence(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  title TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (evidence_id, locale)
);

-- ─── Insights ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  related_work_id UUID REFERENCES work_items(id) ON DELETE SET NULL,
  cover_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS insight_translations (
  insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  title TEXT NOT NULL,
  excerpt TEXT,
  body JSONB NOT NULL DEFAULT '{"format":"html","html":""}'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  PRIMARY KEY (insight_id, locale)
);

-- ─── Page/site content ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  namespace TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (namespace, locale)
);

-- ─── Redirect history ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_redirects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('work', 'insight')),
  content_id UUID NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'id')),
  old_slug TEXT NOT NULL,
  new_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (content_type, locale, old_slug)
);

-- ─── Localized experience ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience_translations (
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  role TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (experience_id, locale)
);

-- ─── Capabilities replace arbitrary proficiency percentages ─────────────────
CREATE TABLE IF NOT EXISTS capabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  category TEXT NOT NULL
    CHECK (category IN ('project-management', 'product', 'engineering', 'research-design', 'tools')),
  level TEXT NOT NULL DEFAULT 'working' CHECK (level IN ('primary', 'working', 'familiar')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS capability_translations (
  capability_id UUID NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'id')),
  name TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (capability_id, locale)
);

-- ─── Updated-at triggers ─────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS update_work_items_updated_at ON work_items;
CREATE TRIGGER update_work_items_updated_at
  BEFORE UPDATE ON work_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_insights_updated_at ON insights;
CREATE TRIGGER update_insights_updated_at
  BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Legacy data migration ───────────────────────────────────────────────────
INSERT INTO work_items (
  id, slug, status, visibility, discipline, work_type, featured, sort_order,
  live_url, repository_url, published_at, created_at, updated_at
)
SELECT
  id,
  slug,
  CASE WHEN status = 'published' THEN 'published' ELSE 'draft' END,
  'public',
  CASE
    WHEN category = 'ui-ux' THEN 'research-design'
    ELSE 'engineering'
  END,
  CASE
    WHEN category = 'tools' THEN 'tool'
    WHEN category = 'ui-ux' THEN 'research'
    ELSE 'product'
  END,
  featured,
  sort_order,
  demo_url,
  github_url,
  CASE WHEN status = 'published' THEN COALESCE(updated_at, created_at) ELSE NULL END,
  created_at,
  updated_at
FROM projects
ON CONFLICT (id) DO NOTHING;

INSERT INTO work_translations (
  work_id, locale, status, title, summary, role, seo_title, seo_description
)
SELECT
  id,
  'en',
  CASE WHEN status = 'published' THEN 'published' ELSE 'draft' END,
  title,
  description,
  role,
  title,
  description
FROM projects
ON CONFLICT (work_id, locale) DO NOTHING;

INSERT INTO media_assets (id, provider, provider_id, url, media_type, is_public)
SELECT
  pi.id,
  CASE WHEN pi.public_id IS NULL THEN NULL ELSE 'cloudinary' END,
  pi.public_id,
  pi.url,
  'image',
  p.status = 'published'
FROM project_images pi
JOIN projects p ON p.id = pi.project_id
ON CONFLICT (url) DO NOTHING;

INSERT INTO media_translations (media_id, locale, alt_text)
SELECT id, 'en', alt_text
FROM project_images
WHERE alt_text IS NOT NULL
ON CONFLICT (media_id, locale) DO NOTHING;

INSERT INTO work_media (work_id, media_id, role, sort_order)
SELECT project_id, id, 'gallery', sort_order
FROM project_images
ON CONFLICT (work_id, media_id, role) DO NOTHING;

INSERT INTO media_assets (provider, provider_id, url, media_type, is_public)
SELECT
  CASE WHEN cover_public_id IS NULL THEN NULL ELSE 'cloudinary' END,
  cover_public_id,
  cover_url,
  'image',
  status = 'published'
FROM projects
WHERE cover_url IS NOT NULL
ON CONFLICT (url) DO NOTHING;

INSERT INTO work_media (work_id, media_id, role, sort_order)
SELECT p.id, m.id, 'cover', 0
FROM projects p
JOIN media_assets m ON m.url = p.cover_url
WHERE p.cover_url IS NOT NULL
ON CONFLICT (work_id, media_id, role) DO NOTHING;

INSERT INTO insights (
  id, slug, status, tags, published_at, created_at, updated_at
)
SELECT
  id,
  slug,
  CASE WHEN status = 'published' THEN 'published' ELSE 'draft' END,
  tags,
  published_at,
  created_at,
  updated_at
FROM blog_posts
ON CONFLICT (id) DO NOTHING;

INSERT INTO insight_translations (
  insight_id, locale, status, title, excerpt, body, seo_title, seo_description
)
SELECT
  id,
  'en',
  CASE WHEN status = 'published' THEN 'published' ELSE 'draft' END,
  title,
  excerpt,
  jsonb_build_object('format', 'html', 'html', COALESCE(content, '')),
  title,
  excerpt
FROM blog_posts
ON CONFLICT (insight_id, locale) DO NOTHING;

INSERT INTO experience_translations (experience_id, locale, role, description)
SELECT id, 'en', role, description
FROM experiences
ON CONFLICT (experience_id, locale) DO NOTHING;

INSERT INTO capabilities (id, key, category, level, sort_order, is_visible)
SELECT
  id,
  trim(BOTH '-' FROM regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')),
  CASE
    WHEN category = 'design' THEN 'research-design'
    WHEN category = 'tools' THEN 'tools'
    ELSE 'engineering'
  END,
  'working',
  sort_order,
  TRUE
FROM skills
ON CONFLICT (id) DO NOTHING;

INSERT INTO capability_translations (capability_id, locale, name)
SELECT id, 'en', name
FROM skills
ON CONFLICT (capability_id, locale) DO NOTHING;

-- Initial site-content records replace public copy being scattered through JSX.
INSERT INTO site_content (namespace, locale, status, content) VALUES
  (
    'navigation',
    'en',
    'published',
    '{"work":"Work","about":"About","insights":"Insights","contact":"Contact","resume":"Resume"}'
  ),
  (
    'navigation',
    'id',
    'published',
    '{"work":"Karya","about":"Tentang","insights":"Insight","contact":"Kontak","resume":"CV"}'
  ),
  (
    'home.hero',
    'en',
    'published',
    '{"status":"","name":"Hafizh Rizqullah Prasetya","positioning":"IT project management with hands-on experience in product development and technical implementation.","primary_cta":"View work","secondary_cta":"Resume"}'
  ),
  (
    'home.hero',
    'id',
    'published',
    '{"status":"","name":"Hafizh Rizqullah Prasetya","positioning":"Pengelolaan proyek IT dengan pengalaman langsung di pengembangan produk dan implementasi teknis.","primary_cta":"Lihat karya","secondary_cta":"CV"}'
  ),
  (
    'work.index',
    'en',
    'published',
    '{"title":"Work","intro":"Selected work across project delivery, product systems, engineering, and research."}'
  ),
  (
    'work.index',
    'id',
    'published',
    '{"title":"Karya","intro":"Pilihan pekerjaan di pengelolaan proyek, pengembangan produk dan sistem, engineering, serta riset."}'
  ),
  (
    'insights.index',
    'en',
    'published',
    '{"title":"Insights","intro":"Notes from real projects, technical exploration, research, and day-to-day project practice."}'
  ),
  (
    'insights.index',
    'id',
    'published',
    '{"title":"Insight","intro":"Catatan dari proyek, eksplorasi teknis, riset, dan praktik kerja yang benar-benar dijalani."}'
  ),
  (
    'contact.intro',
    'en',
    'published',
    '{"title":"Contact","intro":"For relevant project, product, or technical conversations, use the form or reach out directly by email."}'
  ),
  (
    'contact.intro',
    'id',
    'published',
    '{"title":"Kontak","intro":"Untuk diskusi terkait proyek, produk, atau pekerjaan teknis yang relevan, gunakan formulir atau hubungi saya langsung melalui email."}'
  )
ON CONFLICT (namespace, locale) DO NOTHING;

-- ─── RLS for v2 content ──────────────────────────────────────────────────────
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_evidence_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE capability_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read public media"
  ON media_assets FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Portfolio admin full access media"
  ON media_assets FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read media translations"
  ON media_translations FOR SELECT USING (
    EXISTS (SELECT 1 FROM media_assets m WHERE m.id = media_id AND m.is_public = TRUE)
  );
CREATE POLICY "Portfolio admin full access media translations"
  ON media_translations FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read published work"
  ON work_items FOR SELECT USING (status = 'published' AND visibility = 'public');
CREATE POLICY "Portfolio admin full access work"
  ON work_items FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read published work translations"
  ON work_translations FOR SELECT USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM work_items w
      WHERE w.id = work_id AND w.status = 'published' AND w.visibility = 'public'
    )
  );
CREATE POLICY "Portfolio admin full access work translations"
  ON work_translations FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read published work media"
  ON work_media FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM work_items w
      WHERE w.id = work_id AND w.status = 'published' AND w.visibility = 'public'
    )
  );
CREATE POLICY "Portfolio admin full access work media"
  ON work_media FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read published work evidence"
  ON work_evidence FOR SELECT USING (
    is_public = TRUE
    AND EXISTS (
      SELECT 1 FROM work_items w
      WHERE w.id = work_id AND w.status = 'published' AND w.visibility = 'public'
    )
  );
CREATE POLICY "Portfolio admin full access work evidence"
  ON work_evidence FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read evidence translations"
  ON work_evidence_translations FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM work_evidence e
      JOIN work_items w ON w.id = e.work_id
      WHERE e.id = evidence_id
        AND e.is_public = TRUE
        AND w.status = 'published'
        AND w.visibility = 'public'
    )
  );
CREATE POLICY "Portfolio admin full access evidence translations"
  ON work_evidence_translations FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read published insights"
  ON insights FOR SELECT USING (status = 'published');
CREATE POLICY "Portfolio admin full access insights"
  ON insights FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read published insight translations"
  ON insight_translations FOR SELECT USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM insights i
      WHERE i.id = insight_id AND i.status = 'published'
    )
  );
CREATE POLICY "Portfolio admin full access insight translations"
  ON insight_translations FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read published site content"
  ON site_content FOR SELECT USING (status = 'published');
CREATE POLICY "Portfolio admin full access site content"
  ON site_content FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read redirects"
  ON content_redirects FOR SELECT USING (TRUE);
CREATE POLICY "Portfolio admin full access redirects"
  ON content_redirects FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read experience translations"
  ON experience_translations FOR SELECT USING (TRUE);
CREATE POLICY "Portfolio admin full access experience translations"
  ON experience_translations FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read visible capabilities"
  ON capabilities FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "Portfolio admin full access capabilities"
  ON capabilities FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "Public read capability translations"
  ON capability_translations FOR SELECT USING (
    EXISTS (SELECT 1 FROM capabilities c WHERE c.id = capability_id AND c.is_visible = TRUE)
  );
CREATE POLICY "Portfolio admin full access capability translations"
  ON capability_translations FOR ALL USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());
