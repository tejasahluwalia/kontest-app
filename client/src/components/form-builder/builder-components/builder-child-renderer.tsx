import { Match, Switch, batch, createMemo, type Component } from "solid-js";
import type { Child } from "../primitives/children";
import type { InputField } from "../primitives/fields";
import { useFormBuilder } from "../form-builder-context";
import { BuilderFieldRenderer } from "./builder-field-renderer";
import { Button } from "@client/components/ui/button";

interface BuilderChildRendererProps {
  child: Child;
  blockId: string;
  stepId: string;
}

const BuilderChildRenderer: Component<BuilderChildRendererProps> = (props) => {
  const { setSelectedChildId, setSelectedBlockId, setSelectedStepId, removeChildFromBlock, selectedChild } = useFormBuilder();
  const { child, blockId, stepId } = props;
  const { id } = child;
  
  const isActive = createMemo(() => selectedChild()?.id === id);

  const handleOnDelete = () => {
    batch(() => {
      removeChildFromBlock(id, blockId);
      setSelectedChildId('');
    });
  };

  const handleOnSelect = () => {
    batch(() => {
      setSelectedStepId(stepId);
      setSelectedBlockId(blockId);
      setSelectedChildId(id);
    });
  };

  return (
    <Switch>
      <Match when={child.childType === "field"}>
        <BuilderFieldRenderer child={child as InputField} blockId={blockId} stepId={stepId} />
      </Match>
      <Match when={child.childType === "display"}>
        <div class={`border p-4 rounded-md relative transition-all group/child border-border hover:border-muted-foreground"}`}>
          <div 
            onClick={handleOnSelect}
            class="w-full h-full"
          >
            <p class="text-muted-foreground">Display component: {id}</p>
            <p class="text-sm text-muted-foreground">This display type is not implemented yet</p>
          </div>
          
          <div class="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="sm" 
              class="transition-opacity group-hover/child:opacity-100 opacity-0"
              onClick={handleOnDelete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </Button>
          </div>
        </div>
      </Match>
    </Switch>
  );
};

export default BuilderChildRenderer;
