import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import invariant from "tiny-invariant";
config({ path: ".env" });

invariant(
  process.env.DATABASE_URL,
  "DATABASE_URL is not defined. Please set it in your .env file.",
);

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql });
