import type { organization } from "@server/database/schema";
import { createContext } from "solid-js";

const OrganizationContext = createContext<typeof organization.$inferSelect>();

export default OrganizationContext;
