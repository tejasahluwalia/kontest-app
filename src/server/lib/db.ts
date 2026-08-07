import * as schema from "@db/schema";
import { drizzle } from "drizzle-orm/node-postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw Error("DATABASE_URL missing");

export const db = drizzle(DATABASE_URL, {
	schema,
});
