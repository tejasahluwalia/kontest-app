import { createMemo } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
import BuilderStepRenderer from "./builder-components/builder-step-renderer";

export function FormBuilderCanvas() {
  const {
    formSchema,
    selectedStepId
  } = useFormBuilder();

  // Only show the selected step for editing
  const selectedStepNode = createMemo(() => formSchema.graph[selectedStepId()]);

  return (
    <div class="space-y-6">
      {/* Only render the currently selected step */}
      {selectedStepNode() && (
        <BuilderStepRenderer graph={selectedStepNode} />
      )}
      
      {!selectedStepNode() && (
        <div class="p-6 text-center text-muted-foreground border rounded-lg">
          <p>Please select a step from the Form Flow tab to edit its contents.</p>
        </div>
      )}
    </div>
  );
}
