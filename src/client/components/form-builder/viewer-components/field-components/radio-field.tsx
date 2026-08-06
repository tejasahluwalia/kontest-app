import { For } from "solid-js";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import type { RadioField } from "../../primitives/fields";
import { FieldWrapper } from "./field-wrapper";

interface RadioFieldProps {
	child: RadioField;
	blockId: string;
	stepId: string;
}

export function RadioField(props: RadioFieldProps) {
	return (
		<FieldWrapper
			childId={props.child.id}
			blockId={props.blockId}
			stepId={props.stepId}
			label={props.child.label}
			helpText={props.child.helpText}
			required={props.child.required}
		>
			<RadioGroup disabled>
				<For each={props.child.options || []}>
					{(option) => (
						<div class="flex items-center space-x-2">
							<RadioGroupItem value={option.value} id={option.id} />
							<Label for={option.id}>{option.label}</Label>
						</div>
					)}
				</For>
			</RadioGroup>
		</FieldWrapper>
	);
}
