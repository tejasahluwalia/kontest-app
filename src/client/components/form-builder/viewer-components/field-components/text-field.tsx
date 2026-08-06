import { createSignal } from "solid-js";
import type { SetStoreFunction } from "~/compat/solid-store";
import {
	TextFieldInput,
	TextField as TextFieldWrapper,
} from "~/components/ui/text-field";
import type { TextField } from "../../primitives/fields";
import type { InputFormData } from "../../primitives/form";
import { FieldWrapper } from "./field-wrapper";

interface TextFieldProps {
	child: TextField;
	blockId: string;
	stepId: string;
	updateFormData: SetStoreFunction<InputFormData>;
	formData: InputFormData;
}

export function TextField(props: TextFieldProps) {
	const initialValue = () =>
		props.formData?.[props.stepId]?.[props.blockId]?.[props.child.id] || "";
	const [value, setValue] = createSignal(
		(initialValue().value as string) ?? "",
	);

	const handleSave = () => {
		if (props.updateFormData) {
			props.updateFormData(props.stepId, props.blockId, props.child.id, {
				label: props.child.label,
				value: value(),
				fieldType: props.child.fieldType,
			});
		}
	};

	return (
		<FieldWrapper
			childId={props.child.id}
			blockId={props.blockId}
			stepId={props.stepId}
			label={props.child.label}
			helpText={props.child.helpText}
			required={props.child.required}
		>
			<TextFieldWrapper value={value()} onChange={setValue}>
				<TextFieldInput
					onBlur={handleSave}
					placeholder={props.child.placeholder || "Enter text..."}
				/>
			</TextFieldWrapper>
		</FieldWrapper>
	);
}
