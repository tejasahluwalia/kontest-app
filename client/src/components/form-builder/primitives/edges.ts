import { createId } from "@paralleldrive/cuid2";

export interface Edge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}

export type Edges = Edge[];

export const createEdge = (source: string, target: string): Edge => ({
  id: createId(),
  source,
  target
});
