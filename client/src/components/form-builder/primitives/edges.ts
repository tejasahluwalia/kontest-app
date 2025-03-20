import { createId } from "@paralleldrive/cuid2";
import type { ConditionalRule } from "./conditions";

export type Edges = ConditionalRule[];

export const createEdge = (): ConditionalRule => ({
  id: createId(),
  condition: {
    id: createId(),
    operator: 'and',
    conditions: []
  },
  action: {
    id: createId(),
    name: '',
    value: ''
  }
});
