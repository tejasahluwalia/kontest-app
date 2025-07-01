import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/solid";

const PUBLIC_AUTH_URL = import.meta.env.PUBLIC_AUTH_URL;

if (!PUBLIC_AUTH_URL) throw Error("PUBLIC_AUTH_URL missing");

export const authClient = createAuthClient({
	baseURL: PUBLIC_AUTH_URL,
	plugins: [emailOTPClient()],
});
