import {
	type Component,
	createSignal,
	Errored,
	For,
	storePath,
} from "solid-js";
import { InlineEdit } from "~/components/ui/inline-edit";
import { useFormBuilder } from "../form-builder-context";
import BuilderBlockRenderer from "./builder-block-renderer";

const BuilderStepRenderer: Component = () => {
	const { setFormSchema, selectedStepId, selectedStep, saveForm } =
		useFormBuilder();
	const [label, setLabel] = createSignal(selectedStep()?.step.label || "");

	function handleLabelChange() {
		setFormSchema(
			storePath("graph", (node) => node.step.id === selectedStepId(), "step", {
				label: label(),
			}),
		);
		saveForm();
	}

	return (
		<div>
			<h2 class="text-xl font-bold mb-4">
				<InlineEdit
					value={label}
					setValue={setLabel}
					onSave={handleLabelChange}
				/>
			</h2>

			<div class="space-y-4 mb-4">
				<For each={selectedStep()?.blocks}>
					{(block) => (
						<Errored fallback={"Error rendering block"}>
							<BuilderBlockRenderer block={block} />
						</Errored>
					)}
				</For>
			</div>

			{/* <Button
				variant="outline"
				class="w-full"
				onClick={() => {
					addBlockToStep(createBlock(), selectedStepId());
				}}
			>
				Add Block
			</Button> */}
		</div>
	);
};

export default BuilderStepRenderer;
