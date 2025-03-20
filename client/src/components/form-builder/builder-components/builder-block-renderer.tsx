import { For, batch, createMemo, type Component } from "solid-js";
import type { Block } from "../primitives/blocks";
import BuilderChildRenderer from "./builder-child-renderer";
import { useFormBuilder } from "../form-builder-context";
import { FieldSelectionModal } from "./field-selection-modal";
import { Button } from "@client/components/ui/button";
import { Card, CardContent, CardHeader } from "@client/components/ui/card";

const BuilderBlockRenderer: Component<{ block: Block, stepId: string }> = ({ block, stepId }) => {
  const { setSelectedBlockId, removeBlockFromStep, selectedBlockId, setSelectedStepId, selectedBlock } = useFormBuilder();
  const { id, children } = block;

  return (
    <Card
      onClick={(e) => {
        batch(() => {
          setSelectedStepId(stepId);
          setSelectedBlockId(id);
        });
      }}
    >
      <CardHeader>
        <div class="flex items-center justify-between mb-3">
          <div >
            Block: {block.label || id}
          </div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              class="transition-opacity opacity-100"
              onClick={(e: MouseEvent) => {
                batch(() => {
                  removeBlockFromStep(id, stepId);
                  setSelectedBlockId('');
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <For each={children}>
            {(child) => (
              <BuilderChildRenderer child={child} blockId={id} stepId={stepId} />
            )}
          </For>

          <FieldSelectionModal blockId={id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BuilderBlockRenderer;
