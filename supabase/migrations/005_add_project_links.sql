-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 005: Add demo_url and github_url columns to projects
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS demo_url   TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT;
