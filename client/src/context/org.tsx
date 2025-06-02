import type { org } from "@server/database/schema";
import { createContext } from "solid-js";

const OrgContext = createContext<typeof org.$inferSelect>();

export default OrgContext;
