-- Case-file content for projects and work experience.
-- Keeps the existing nine-table model: no new relation is introduced.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS description_id TEXT,
  ADD COLUMN IF NOT EXISTS context TEXT,
  ADD COLUMN IF NOT EXISTS decision TEXT,
  ADD COLUMN IF NOT EXISTS outcome TEXT,
  ADD COLUMN IF NOT EXISTS context_id TEXT,
  ADD COLUMN IF NOT EXISTS decision_id TEXT,
  ADD COLUMN IF NOT EXISTS outcome_id TEXT,
  ADD COLUMN IF NOT EXISTS evidence_items JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS description_id TEXT,
  ADD COLUMN IF NOT EXISTS context TEXT,
  ADD COLUMN IF NOT EXISTS decision TEXT,
  ADD COLUMN IF NOT EXISTS outcome TEXT,
  ADD COLUMN IF NOT EXISTS context_id TEXT,
  ADD COLUMN IF NOT EXISTS decision_id TEXT,
  ADD COLUMN IF NOT EXISTS outcome_id TEXT,
  ADD COLUMN IF NOT EXISTS evidence_items JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN projects.evidence_items IS
  'Public evidence metadata. Sensitive source documents must be redacted before their URL is stored.';

COMMENT ON COLUMN experiences.evidence_items IS
  'Public evidence metadata. Sensitive source documents must be redacted before their URL is stored.';

UPDATE site_settings
SET value = '{"site_title":"Hafizh Rizqullah Prasetya","tagline":"Project Management Officer · IT & Strategy"}'::jsonb
WHERE key = 'general';

UPDATE site_settings
SET value = '{"meta_description":"Case-file portfolio of Hafizh Rizqullah Prasetya, a Project Management Officer in IT who plans, reads, and builds the systems behind delivery.","og_image":""}'::jsonb
WHERE key = 'seo';
