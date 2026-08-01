-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 003: Add cover image columns to projects
-- Purpose: Store a single cover image URL + Cloudinary public_id directly on
--          the projects row for fast retrieval (grid/cards), separate from the
--          project_images gallery table.
-- Run this in: Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS cover_url       TEXT,
  ADD COLUMN IF NOT EXISTS cover_public_id TEXT;
