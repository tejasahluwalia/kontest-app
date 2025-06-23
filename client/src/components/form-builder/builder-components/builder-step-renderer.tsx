import { Button } from "@client/components/ui/button";
import { InlineEdit } from "@client/components/ui/inline-edit";
import { type Component, createSignal, For } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import { createBlock } from "../primitives/blocks";
import BuilderBlockRenderer from "./builder-block-renderer";

const BuilderStepRenderer: Component = () => {
	const {
		setFormSchema,
		addBlockToStep,
		selectedStepId,
		selectedStep,
		saveForm,
	} = useFormBuilder();
	const [label, setLabel] = createSignal(selectedStep()?.step.label || "");

	function handleLabelChange() {
		setFormSchema(
			"graph",
			(node) => node.step.id === selectedStepId(),
			"step",
			{ label: label() },
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
					{(block) => <BuilderBlockRenderer block={block} />}
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
