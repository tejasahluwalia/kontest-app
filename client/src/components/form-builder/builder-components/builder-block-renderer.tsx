import { For, batch, createMemo, type Component } from "solid-js";
import type { Block } from "../primitives/blocks";
import BuilderChildRenderer from "./builder-child-renderer";
import { useFormBuilder } from "../form-builder-context";
import { FieldSelectionModal } from "./field-selection-modal";
import { Button } from "@client/components/ui/button";

const BuilderBlockRenderer: Component<{block: Block, stepId: string}> = ({block, stepId}) => {
  const { setSelectedBlockId, removeBlockFromStep, selectedBlockId, setSelectedStepId, selectedBlock } = useFormBuilder();
  const { id, children } = block;
    
  return (
    <div 
      onClick={(e) => {
        batch(() => {
          setSelectedStepId(stepId);
          setSelectedBlockId(id);
        });
      }} 
      class={`border rounded-md p-4 mb-4 transition-all relative group/block border-border hover:border-muted-foreground`}
    >
      <div class="absolute top-2 right-2">
        <Button 
          variant="ghost" 
          size="sm" 
          class="transition-opacity group-hover/block:opacity-100 opacity-0"
          onClick={(e: MouseEvent) => {
            batch(() => {
              removeBlockFromStep(id, stepId);
              setSelectedBlockId('');
            });
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </Button>
      </div>
      
      <div class="flex items-center mb-3">
        <div class="text-sm font-medium">
          Block: {block.label || id}
        </div>
      </div>
      
      <div class="space-y-3">
        <For each={children}>
          {(child) => (
            <BuilderChildRenderer child={child} blockId={id} stepId={stepId} />
          )}
        </For>
        
        <FieldSelectionModal blockId={id} />
      </div>
    </div>
  );
};

export default BuilderBlockRenderer;
