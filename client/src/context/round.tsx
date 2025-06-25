import type { round } from "@server/database/schema";
import { createContext } from "solid-js";

const RoundContext = createContext<typeof round.$inferSelect>();

export default RoundContext;
