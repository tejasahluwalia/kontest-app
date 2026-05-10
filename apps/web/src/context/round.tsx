import type { round } from "database/schema";
import { createContext } from "solid-js";

const RoundContext = createContext<typeof round.$inferSelect>();

export default RoundContext;
