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
      ('project-alpha', 'Project Alpha', 'A revolutionary new platform for real-time collaboration.', 'Web Application', ARRAY['Next.js', 'Supabase', 'Tailwind CSS'], true, 1, 'published'),
      ('project-beta', 'Design System', 'A comprehensive UI kit and design system built from the ground up.', 'UI/UX Design', ARRAY['Figma', 'React', 'Storybook'], true, 2, 'published'),
      ('project-gamma', 'E-Commerce Replatforming', 'Migrated a legacy monolithic storefront to a headless commerce architecture.', 'E-Commerce', ARRAY['Shopify Plus', 'Hydrogen', 'Remix'], true, 3, 'published')
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
