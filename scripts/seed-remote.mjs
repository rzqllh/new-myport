import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  const dbUrl = process.env.SUPABASE_DB_URL || '***REMOVED***';
  
  if (!dbUrl) {
    console.error('Missing SUPABASE_DB_URL in environment');
    process.exit(1);
  }

  const sql = postgres(dbUrl, { ssl: 'require' });

  try {
    const seedFilePath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    const seedFileContent = fs.readFileSync(seedFilePath, 'utf8');

    console.log('Running seed.sql...');
    
    // run the raw SQL file
    await sql.unsafe(seedFileContent);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await sql.end();
  }
}

seed();
