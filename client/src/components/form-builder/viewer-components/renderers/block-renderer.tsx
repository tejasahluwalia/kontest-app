import { For, type Component } from "solid-js";
import type { Block } from "../../primitives/blocks";
import ChildRenderer from "./child-renderer";
import { useFormBuilder } from "../../form-builder-context";
import { Button } from "@client/components/ui/button";
import { createChild } from "../../primitives/children";
import type { InputFormData } from "../../primitives/form";
import type { SetStoreFunction } from "solid-js/store";

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
