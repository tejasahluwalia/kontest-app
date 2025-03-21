import { createMemo, Show } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
import BuilderStepRenderer from "./builder-components/builder-step-renderer";

export function FormBuilderCanvas() {
  const {
    formSchema,
    selectedStepId
  } = useFormBuilder();

  // Only show the selected step for editing
  const selectedStepNode = createMemo(() => formSchema.graph.find(node => node.step.id === selectedStepId()));

  return (
    <div class="space-y-6">
      {/* Only render the currently selected step */}
      <Show when={selectedStepNode()}>
        {(node) => <BuilderStepRenderer node={node} />}
      </Show>
      
      {!selectedStepNode() && (
        <div class="p-6 text-center text-muted-foreground border rounded-lg">
          <p>Please select a step from the Form Flow tab to edit its contents.</p>
        </div>
      )}
    </div>
  );
}
