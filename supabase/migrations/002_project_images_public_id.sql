-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002: Add public_id to project_images
-- Purpose: Store the Cloudinary public_id alongside the URL so images can be
--          programmatically deleted from Cloudinary in the future.
-- Run this in: Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE project_images
  ADD COLUMN IF NOT EXISTS public_id TEXT;
