import type { StoreSetter } from "solid-js";
import { For } from "solid-js";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { CheckboxField as CheckboxFieldType } from "../../primitives/fields";
import type { InputFormData } from "../../primitives/form";
import { FieldWrapper } from "./field-wrapper";

interface CheckboxFieldProps {
	child: CheckboxFieldType;
	blockId: string;
	stepId: string;
	formData?: InputFormData;
	updateFormData?: StoreSetter<InputFormData>;
}

export function CheckboxField(props: CheckboxFieldProps) {
	return (
		<FieldWrapper
			childId={props.child.id}
			blockId={props.blockId}
			stepId={props.stepId}
			label={props.child.label}
			helpText={props.child.helpText}
			required={props.child.required}
		>
			<div class="space-y-2">
				<For each={props.child.options || []}>
					{(option) => (
						<div class="flex items-center space-x-2">
							<Checkbox id={option.id} disabled />
							<Label for={option.id}>{option.label}</Label>
						</div>
					)}
				</For>
			</div>
		</FieldWrapper>
	);
}
