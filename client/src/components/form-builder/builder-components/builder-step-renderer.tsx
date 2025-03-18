import { Button } from "@client/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@client/components/ui/card";
import { batch, For, type Component } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import { createBlock } from "../primitives/blocks";
import type { StepGraphNode } from "../primitives/form";
import BuilderBlockRenderer from "./builder-block-renderer";

interface BuilderStepRendererProps {
 graph: StepGraphNode
}

const BuilderStepRenderer: Component<BuilderStepRendererProps> = (props) => {
  const { 
    setSelectedStepId, 
    selectedStepId, 
    addBlockToStep, 
    removeStepFromGraph,
    updateStepInGraph,
    selectedStep
  } = useFormBuilder();
  const { step, blocks } = props.graph
  const isActive = () => selectedStep()?.step.id === step.id;
  
  return (
    <Card 
      class={`mb-6 transition-all group ${isActive() ? "border-primary shadow-sm" : "border-border hover:border-muted-foreground"}`}
      onClick={() => setSelectedStepId(step.id)}
    >
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-xl font-bold">{step.label}</CardTitle>
        <div class="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            class={`transition-opacity ${isActive() ? "opacity-100" : "group-hover:opacity-100 opacity-0"}`}
            onClick={() => {
              batch(() => {
                removeStepFromGraph(step.id);
                setSelectedStepId('');
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
      </CardHeader>
      
      <CardContent>
        <div class="space-y-4">
          <For each={blocks}>
            {(block) => (
              <BuilderBlockRenderer block={block} stepId={step.id} />
            )}
          </For>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          class="w-full"
          onClick={() => {
            addBlockToStep(createBlock(), step.id);
          }}
        >
          Add Block
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuilderStepRenderer;
