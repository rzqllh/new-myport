import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("Missing SUPABASE_DB_URL in .env");
}

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to Supabase DB. Reloading schema cache...");
    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log("Schema cache reloaded successfully.");
  } catch (err) {
    console.error("Failed to reload schema:", err);
  } finally {
    await client.end();
  }
}

main();
