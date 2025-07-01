import * as schema from "database/schema";
import { drizzle } from "drizzle-orm/node-postgres";

const DATABASE_URL = Bun.env.DATABASE_URL;

if (!DATABASE_URL) throw Error("DATABASE_URL missing");

export const db = drizzle(DATABASE_URL, {
	schema,
});
