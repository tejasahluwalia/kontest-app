import type { call, round } from "@db/schema";
import { createContext } from "solid-js";

export type CallContextType = typeof call.$inferSelect & {
	rounds?: (typeof round.$inferSelect)[];
};

const CallContext = createContext<CallContextType | any>();

export default CallContext;
