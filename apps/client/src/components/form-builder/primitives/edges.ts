import { nanoid } from "nanoid";
import type { ConditionalRule } from "./conditions";

export type Edges = ConditionalRule[];

export const createEdge = (): ConditionalRule => ({
	id: `edge_${nanoid()}`,
	condition: {
		id: `grp_${nanoid()}`,
		operator: "and",
		conditions: [],
	},
	action: {
		id: "submit",
		name: "Submit",
		value: "submit",
	},
});
