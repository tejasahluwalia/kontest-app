import { type Component, For, type StoreSetter } from "solid-js";
import type { Block } from "../../primitives/blocks";
import type { InputFormData } from "../../primitives/form";
import ChildRenderer from "./child-renderer";

interface BlockRendererProps {
	block: Block;
	stepId: string;
	formData: InputFormData;
	updateFormData: StoreSetter<InputFormData>;
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
