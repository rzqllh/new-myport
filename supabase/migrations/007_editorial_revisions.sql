-- Phase 13: editorial revision history
-- Snapshots are intentionally limited to editorial copy. Slugs and structural
-- metadata are not restored through this mechanism.

CREATE TABLE IF NOT EXISTS content_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_type TEXT NOT NULL
    CHECK (resource_type IN ('work_translation', 'insight_translation', 'site_content')),
  resource_id TEXT NOT NULL,
  locale TEXT CHECK (locale IN ('en', 'id')),
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_revisions_lookup_idx
  ON content_revisions (resource_type, resource_id, locale, created_at DESC);

ALTER TABLE content_revisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Portfolio admins read content revisions" ON content_revisions;
CREATE POLICY "Portfolio admins read content revisions"
  ON content_revisions FOR SELECT
  USING (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Portfolio admins create content revisions" ON content_revisions;
CREATE POLICY "Portfolio admins create content revisions"
  ON content_revisions FOR INSERT
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Portfolio admins delete content revisions" ON content_revisions;
CREATE POLICY "Portfolio admins delete content revisions"
  ON content_revisions FOR DELETE
  USING (public.is_portfolio_admin());

CREATE OR REPLACE FUNCTION public.capture_editorial_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  revision_type TEXT;
  revision_id TEXT;
  revision_locale TEXT;
BEGIN
  IF TG_TABLE_NAME = 'work_translations' THEN
    revision_type := 'work_translation';
    revision_id := NEW.work_id::text;
    revision_locale := NEW.locale;
  ELSIF TG_TABLE_NAME = 'insight_translations' THEN
    revision_type := 'insight_translation';
    revision_id := NEW.insight_id::text;
    revision_locale := NEW.locale;
  ELSIF TG_TABLE_NAME = 'site_content' THEN
    revision_type := 'site_content';
    revision_id := NEW.namespace;
    revision_locale := NEW.locale;
  ELSE
    RAISE EXCEPTION 'Unsupported revision source table: %', TG_TABLE_NAME;
  END IF;

  INSERT INTO content_revisions (
    resource_type,
    resource_id,
    locale,
    snapshot,
    created_by
  ) VALUES (
    revision_type,
    revision_id,
    revision_locale,
    to_jsonb(NEW),
    auth.uid()
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS capture_work_translation_revision ON work_translations;
CREATE TRIGGER capture_work_translation_revision
  AFTER INSERT OR UPDATE ON work_translations
  FOR EACH ROW EXECUTE FUNCTION public.capture_editorial_revision();

DROP TRIGGER IF EXISTS capture_insight_translation_revision ON insight_translations;
CREATE TRIGGER capture_insight_translation_revision
  AFTER INSERT OR UPDATE ON insight_translations
  FOR EACH ROW EXECUTE FUNCTION public.capture_editorial_revision();

DROP TRIGGER IF EXISTS capture_site_content_revision ON site_content;
CREATE TRIGGER capture_site_content_revision
  AFTER INSERT OR UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION public.capture_editorial_revision();
