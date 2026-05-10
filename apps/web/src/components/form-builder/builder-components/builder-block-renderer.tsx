import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { InlineEdit } from "~/components/ui/inline-edit";
import Trash from "lucide-solid/icons/trash";
import { type Component, createSignal, For } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import type { Block } from "../primitives/blocks";
import BuilderChildRenderer from "./builder-child-renderer";
import { FieldSelectionModal } from "./field-selection-modal";

const BuilderBlockRenderer: Component<{ block: Block }> = ({ block }) => {
	const { selectedStepId, setFormSchema, saveForm } = useFormBuilder();

	const [label, setLabel] = createSignal(block.label);

	const { id, children } = block;

	function handleRemoveBlock() {
		setFormSchema(
			"graph",
			(node) => node.step.id === selectedStepId(),
			"blocks",
			(blocks) => blocks.filter((b) => b.id !== id),
		);
		saveForm();
	}

	function handleUpdateLabel() {
		setFormSchema(
			"graph",
			(node) => node.step.id === selectedStepId(),
			"blocks",
			(block) => block.id === id,
			{ label: label() },
		);
		saveForm();
	}

	return (
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<div>
						<InlineEdit
							value={label}
							setValue={setLabel}
							onSave={handleUpdateLabel}
						/>
					</div>
					<Button
						variant="secondary"
						size="icon"
						class="transition-opacity opacity-100"
						onClick={handleRemoveBlock}
					>
						<Trash />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div class="space-y-3">
					<For each={children}>
						{(child) => <BuilderChildRenderer child={child} blockId={id} />}
					</For>
					<FieldSelectionModal blockId={id} />
				</div>
			</CardContent>
		</Card>
	);
};

export default BuilderBlockRenderer;
