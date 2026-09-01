import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Force IPv4 if Neon/Supabase DNS resolves to IPv6 and times out
const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("Missing SUPABASE_DB_URL in .env");
}

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to DB directly. Seeding projects...");
    
    await client.query(`
      INSERT INTO projects (slug, title, description, category, tech_stack, featured, sort_order, status)
      VALUES 
      ('lumina', 'Lumina', 'Personal project operating system for photographers and videographers.', 'web-dev', ARRAY['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS'], true, 1, 'published'),
      ('mawmaw-interior', 'Mawmaw Interior Studio', 'Public site and admin CMS for a premium interior design and furniture studio.', 'web-dev', ARRAY['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase Auth', 'Tailwind CSS'], true, 2, 'published'),
      ('summai', 'SummAI', 'Local-first meeting intelligence tool for mixed Indonesian/English meetings.', 'web-dev', ARRAY['Next.js', 'FastAPI', 'SQLite', 'Groq Whisper', 'Google Gemini'], true, 3, 'published'),
      ('rangkai', 'Rangkai', 'AI specification builder generating execution-ready Build Packs.', 'tools', ARRAY['TypeScript'], true, 4, 'published')
      ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        tech_stack = EXCLUDED.tech_stack,
        featured = EXCLUDED.featured,
        status = EXCLUDED.status;
    `);
    
    console.log("Projects seeded directly.");
    
    console.log("Reloading PostgREST schema cache so the UI works too...");
    await client.query("NOTIFY pgrst, 'reload schema'");
    
    console.log("Done.");
  } catch (err) {
    console.error("Failed to seed directly:", err);
  } finally {
    await client.end();
  }
}

main();
