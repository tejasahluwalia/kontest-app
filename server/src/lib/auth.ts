import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {db} from "@server/database";
import { account, session, user, verification } from "@server/database/schema";
import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
  database: drizzleAdapter(db, { // We're using Drizzle as our database
    provider: "pg",
    /*
    * Map your schema into a better-auth schema
    */
    schema: {
      user,
      session,
      verification,
      account,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [emailOTP({
    async sendVerificationOTP(data, request) {
      console.log(data.otp)
    },
  })],
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
});