import { createMemo, Show } from "solid-js";
import BuilderStepRenderer from "./builder-components/builder-step-renderer";
import { useFormBuilder } from "./form-builder-context";

export function FormBuilderCanvas() {
	const { formSchema, selectedStepId } = useFormBuilder();

	// Only show the selected step for editing
	const selectedStepNode = createMemo(() =>
		formSchema.graph.find((node) => node.step.id === selectedStepId()),
	);

	return (
		<div class="space-y-6">
			{/* Only render the currently selected step */}
			<Show
				when={selectedStepNode()}
				fallback={
					<div class="p-6 text-center text-muted-foreground border rounded-lg">
						<p>
							Please select a step from the Form Flow tab to edit its contents.
						</p>
					</div>
				}
			>
				{(node) => <BuilderStepRenderer />}
			</Show>
		</div>
	);
}
