import { type Component, For } from "solid-js";
import type { SetStoreFunction } from "~/compat/solid-store";
import { Button } from "~/components/ui/button";
import { useFormBuilder } from "../../form-builder-context";
import type { Block } from "../../primitives/blocks";
import { createChild } from "../../primitives/children";
import type { InputFormData } from "../../primitives/form";
import ChildRenderer from "./child-renderer";

interface BlockRendererProps {
	block: Block;
	stepId: string;
	formData: InputFormData;
	updateFormData: SetStoreFunction<InputFormData>;
}

const BlockRenderer: Component<BlockRendererProps> = ({
	block,
	stepId,
	formData,
	updateFormData,
}) => {
	const { id, children } = block;
	return (
		<div class="flex items-center justify-between gap-1">
			<div class="grid">
				<div>Block {id}</div>
				<For each={children}>
					{(child) => (
						<ChildRenderer
							child={child}
							blockId={id}
							stepId={stepId}
							formData={formData}
							updateFormData={updateFormData}
						/>
					)}
				</For>
			</div>
		</div>
	);
};

export default BlockRenderer;
