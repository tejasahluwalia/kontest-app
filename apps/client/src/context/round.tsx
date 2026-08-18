import type { round } from "@db/schema";
import { createContext } from "solid-js";

const RoundContext = createContext<typeof round.$inferSelect>();

export default RoundContext;
