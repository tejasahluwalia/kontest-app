import type { contest } from "@server/database/schema";
import { getRouteApi } from "@tanstack/solid-router";
import { createContext } from "solid-js";

const ContestContext = createContext<typeof contest.$inferSelect>();

export default ContestContext;
