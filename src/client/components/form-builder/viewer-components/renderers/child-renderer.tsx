import {
	batch,
	type Component,
	Match,
	type StoreSetter,
	Switch,
} from "solid-js";
import { useFormBuilder } from "../../form-builder-context";
import type { Child } from "../../primitives/children";
import type { InputField } from "../../primitives/fields";
import type { InputFormData } from "../../primitives/form";
import { FieldRenderer } from "../field-components/field-renderer";

interface ChildRendererProps {
	child: Child;
	blockId: string;
	stepId: string;
	formData: InputFormData;
	updateFormData: StoreSetter<InputFormData>;
}

const ChildRenderer: Component<ChildRendererProps> = (props) => {
	const { child, blockId, stepId } = props;
	const { id } = child;

	return (
		<Switch>
			<Match when={child.childType === "field"}>
				<FieldRenderer
					child={child as InputField}
					blockId={blockId}
					stepId={stepId}
					formData={props.formData}
					updateFormData={props.updateFormData}
				/>
			</Match>
			<Match when={child.childType === "display"}>
				<div class="border border-dashed p-4 rounded-md">
					<p class="text-muted-foreground">Display component: {id}</p>
					<p class="text-sm text-muted-foreground">
						This display type is not implemented yet
					</p>
				</div>
			</Match>
		</Switch>
	);
};

export default ChildRenderer;
