import { For, Show, createSignal } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
// import { NodeRenderer } from "./node-components/node-renderer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";
import { createId } from "@paralleldrive/cuid2";
import { createChildren } from "./primitives/children";
import StepRenderer from "./renderers/step-renderer";

export function FormBuilderCanvas() {
  const {
    formSchema,
    selectedStepId,
    setSelectedStepId,
    addStepToGraph,
    removeStepFromGraph,
    updateStepInGraph,
    selectedBlockId,
    setSelectedBlockId,
    selectedChildId,
    setSelectedChildId,
    addBlockToStep,
    removeBlockFromStep
  } = useFormBuilder();

  return (
    <div class="space-y-6">
      <For each={Object.values(formSchema.graph)}>
        {({ step, edges, blocks }) => (
          <StepRenderer step={step} blocks={blocks} edges={edges} />
        )}
      </For>

      <div class="flex justify-center">
        <Button
          variant="outline"
          onClick={() => addStepToGraph({
            id: createId(),
            label: 'New Step',
            nextButtonLabel: 'Next',
            previousButtonLabel: 'Previous',
            showProgressBar: true,
            validate: () => true
          })}
          class="w-full max-w-md"
        >
          Add Step
        </Button>
      </div>
    </div>
  );
}
