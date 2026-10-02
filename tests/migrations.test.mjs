import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import postgres from "postgres";

const databaseUrl = process.env.TEST_DATABASE_URL;

test(
  "tracked Supabase migrations build the v2 schema and preserve representative legacy data",
  { skip: !databaseUrl },
  async () => {
    const sql = postgres(databaseUrl, { max: 1 });

    try {
      await sql.unsafe(`
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
        CREATE SCHEMA IF NOT EXISTS auth;

        CREATE TABLE IF NOT EXISTS auth.users (
          id UUID PRIMARY KEY
        );

        CREATE OR REPLACE FUNCTION auth.uid()
        RETURNS UUID
        LANGUAGE sql
        STABLE
        AS $$ SELECT '11111111-1111-1111-1111-111111111111'::uuid $$;

        CREATE OR REPLACE FUNCTION auth.role()
        RETURNS TEXT
        LANGUAGE sql
        STABLE
        AS $$ SELECT 'authenticated'::text $$;

        INSERT INTO auth.users (id)
        VALUES ('11111111-1111-1111-1111-111111111111')
        ON CONFLICT DO NOTHING;
      `);

      const migrationsDir = new URL("../supabase/migrations/", import.meta.url);
      const files = readdirSync(migrationsDir)
        .filter((name) => name.endsWith(".sql"))
        .sort();

      for (const file of files) {
        if (file === "006_content_model_v2.sql") {
          await sql.unsafe(`
            INSERT INTO projects (
              id, slug, title, description, role, category, tech_stack,
              featured, sort_order, status, created_at, updated_at,
              demo_url, github_url, cover_url, cover_public_id
            ) VALUES (
              '22222222-2222-2222-2222-222222222222',
              'sample-work',
              'Sample Work',
              'Representative legacy project.',
              'Project Lead',
              'web-dev',
              ARRAY['Next.js'],
              TRUE,
              1,
              'published',
              NOW(),
              NOW(),
              'https://example.com',
              'https://github.com/example/sample',
              'https://example.com/cover.jpg',
              'sample-cover'
            );

            INSERT INTO project_images (
              id, project_id, url, public_id, alt_text, sort_order
            ) VALUES (
              '33333333-3333-3333-3333-333333333333',
              '22222222-2222-2222-2222-222222222222',
              'https://example.com/gallery.jpg',
              'sample-gallery',
              'Sample gallery image',
              0
            );

            INSERT INTO blog_posts (
              id, slug, title, content, excerpt, tags, status, published_at
            ) VALUES (
              '44444444-4444-4444-4444-444444444444',
              'sample-insight',
              'Sample Insight',
              '<p>Representative article.</p>',
              'Representative excerpt.',
              ARRAY['Research'],
              'published',
              NOW()
            );

            INSERT INTO experiences (
              id, company, role, description, start_date, sort_order
            ) VALUES (
              '55555555-5555-5555-5555-555555555555',
              'Example Company',
              'Project Officer',
              'Representative experience.',
              '2026-01-01',
              1
            );

            INSERT INTO skills (
              id, name, category, proficiency, sort_order
            ) VALUES (
              '66666666-6666-6666-6666-666666666666',
              'TypeScript',
              'frontend',
              90,
              1
            );
          `);
        }

        const migration = readFileSync(new URL(file, migrationsDir), "utf8");
        await sql.unsafe(migration);
      }

      const [work] = await sql`
        SELECT slug, discipline, work_type
        FROM work_items
        WHERE id = '22222222-2222-2222-2222-222222222222'
      `;
      assert.equal(work.slug, "sample-work");
      assert.equal(work.discipline, "engineering");

      const [translation] = await sql`
        SELECT locale, title, status
        FROM work_translations
        WHERE work_id = '22222222-2222-2222-2222-222222222222'
      `;
      assert.equal(translation.locale, "en");
      assert.equal(translation.title, "Sample Work");
      assert.equal(translation.status, "published");

      const [insight] = await sql`
        SELECT i.slug, t.title
        FROM insights i
        JOIN insight_translations t ON t.insight_id = i.id
        WHERE i.id = '44444444-4444-4444-4444-444444444444'
      `;
      assert.equal(insight.slug, "sample-insight");
      assert.equal(insight.title, "Sample Insight");

      const [capability] = await sql`
        SELECT c.level, t.name
        FROM capabilities c
        JOIN capability_translations t ON t.capability_id = c.id
        WHERE c.id = '66666666-6666-6666-6666-666666666666'
      `;
      assert.equal(capability.level, "working");
      assert.equal(capability.name, "TypeScript");

      const [siteContentCount] = await sql`
        SELECT COUNT(*)::int AS count
        FROM site_content
        WHERE namespace = 'home.hero'
      `;
      assert.equal(siteContentCount.count, 2);

      const [isAdmin] = await sql`
        SELECT public.is_portfolio_admin() AS value
      `;
      assert.equal(isAdmin.value, true);

      await sql`
        UPDATE work_translations
        SET summary = 'Revision test'
        WHERE work_id = '22222222-2222-2222-2222-222222222222'
          AND locale = 'en'
      `;

      const [revisionCount] = await sql`
        SELECT COUNT(*)::int AS count
        FROM content_revisions
        WHERE resource_type = 'work_translation'
          AND resource_id = '22222222-2222-2222-2222-222222222222'
          AND locale = 'en'
      `;
      assert.equal(revisionCount.count > 0, true);
    } finally {
      await sql.end({ timeout: 1 });
    }
  }
);
