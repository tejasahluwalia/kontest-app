import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/solid";

export const authClient = createAuthClient({
	baseURL: import.meta.env.PUBLIC_AUTH_URL, // the base url of your auth server
	plugins: [emailOTPClient()],
});
