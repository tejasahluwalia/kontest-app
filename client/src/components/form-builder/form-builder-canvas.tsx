import { createMemo, For } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
import { Button } from "@client/components/ui/button";
import { createId } from "@paralleldrive/cuid2";
import BuilderStepRenderer from "./builder-components/builder-step-renderer";

export function FormBuilderCanvas() {
  const {
    formSchema,
    addStepToGraph
  } = useFormBuilder();

  const graphNodes = createMemo(() => Object.values(formSchema.graph));

  return (
    <div class="space-y-6">
      <For each={graphNodes()}>
        {(graph) => (
          <BuilderStepRenderer graph={graph} />
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
