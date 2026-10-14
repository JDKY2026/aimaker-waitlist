import { Client, Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/ai_maker_waitlist";

export const pool = new Pool({ connectionString });

async function createDatabaseIfMissing() {
  const url = new URL(connectionString);
  const dbName = decodeURIComponent(url.pathname.replace(/^\//, ""));
  if (!dbName) throw new Error("DATABASE_URL must include a database name");
  url.pathname = "/postgres";
  const admin = new Client({ connectionString: url.toString() });
  try {
    await admin.connect();
    await admin.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
  } catch (err) {
    if ((err as { code?: string }).code !== "42P04") throw err;
  } finally {
    await admin.end();
  }
}

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      try {
        await createTable();
      } catch (err) {
        if ((err as { code?: string }).code === "3D000") {
          await createDatabaseIfMissing();
          await createTable();
        } else {
          throw err;
        }
      }
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
