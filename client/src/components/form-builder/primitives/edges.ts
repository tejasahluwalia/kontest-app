import { nanoid } from "nanoid";
import type { ConditionalRule } from "./conditions";

export type Edges = ConditionalRule[];

export const createEdge = (): ConditionalRule => ({
	id: nanoid(),
	condition: {
		id: nanoid(),
		operator: "and",
		conditions: [],
	},
	action: {
		id: "submit",
		name: "Submit",
		value: "submitFrom",
	},
});
