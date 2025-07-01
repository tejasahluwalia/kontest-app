import type { org } from "database/schema";
import { createContext } from "solid-js";

const OrgContext = createContext<typeof org.$inferSelect>();

export default OrgContext;
