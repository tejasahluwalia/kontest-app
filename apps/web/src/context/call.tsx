import type { call } from "database/schema";
import { getRouteApi } from "@tanstack/solid-router";
import { createContext } from "solid-js";

const CallContext = createContext<typeof call.$inferSelect>();

export default CallContext;
