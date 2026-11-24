// Applies supabase/migrations/*.sql in name order, once each.
// Usage: npm run migrate   (needs DATABASE_URL in .env)
import { readdirSync, readFileSync } from "node:fs";
import pg from "pg";

const dir = new URL("../supabase/migrations/", import.meta.url);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query("create table if not exists public._migrations (name text primary key, applied_at timestamptz default now())");
  await client.query("alter table public._migrations enable row level security"); // never readable with the public key
  const done = new Set((await client.query("select name from public._migrations")).rows.map((r) => r.name));
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    if (done.has(name)) continue;
    await client.query("begin");
    try {
      await client.query(readFileSync(new URL(name, dir), "utf8"));
      await client.query("insert into public._migrations (name) values ($1)", [name]);
      await client.query("commit");
      console.log(`applied ${name}`);
    } catch (e) {
      await client.query("rollback");
      throw e;
    }
  }
  console.log("migrations up to date");
} finally {
  await client.end();
}
