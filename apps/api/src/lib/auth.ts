import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	createAuthMiddleware,
	customSession,
	emailOTP,
} from "better-auth/plugins";
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
			async sendVerificationOTP(data) {
				console.log(data.otp);
			},
		}),
	],
	trustedOrigins: [
		"http://localhost:3000",
		"http://localhost:5173",
		"http://localhost:4173",
	],
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					// Add created user to invited orgs
					const memberInvites = await db.query.memberInvite.findMany({
						where: (mi, { eq }) => eq(mi.email, user.email),
					});
					for (const invite of memberInvites) {
						await db.insert(schema.member).values({
							orgId: invite.orgId,
							userId: user.id,
							role: invite.role,
						});
					}
				},
			},
		},
	},
});
