import { Button } from "@client/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@client/components/ui/card";
import { batch, For, type Component, type Accessor } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import { createBlock } from "../primitives/blocks";
import type { StepGraphNode } from "../primitives/form";
import BuilderBlockRenderer from "./builder-block-renderer";

interface BuilderStepRendererProps {
  node: Accessor<StepGraphNode>
}

const BuilderStepRenderer: Component<BuilderStepRendererProps> = ({node}) => {
  const {
    addBlockToStep,
  } = useFormBuilder();

  return (
    <div>
      <h2 class="text-xl font-bold mb-4">{node().step.label}</h2>

      <div class="space-y-4 mb-4">
        <For each={node().blocks}>
          {(block) => (
            <BuilderBlockRenderer block={block} stepId={node().step.id} />
          )}
        </For>
      </div>

      <Button
        variant="outline"
        class="w-full"
        onClick={() => {
          addBlockToStep(createBlock(), node().step.id);
        }}
      >
        Add Block
      </Button>
    </div>
  );
};

export default BuilderStepRenderer;
