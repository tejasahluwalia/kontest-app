import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";
import * as schema from "./schema";

export * from "./env";
export * from "./model";
export * from "./schema";
export * as schema from "./schema";
export * from "./utils";

export const createDb = (url: string = env.DATABASE_URL) => {
	return drizzle(url, {
		relations: schema.relations,
	});
};

export const db = createDb();
