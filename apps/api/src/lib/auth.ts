import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import * as schema from "database/schema";
import { db } from "./db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP(data, request) {
				console.log(data.otp);
			},
		}),
	],
	trustedOrigins: [
		"http://localhost:3000",
		"http://localhost:5173",
		"http://localhost:4173",
	],
});
