import { createSignal, type JSX } from "solid-js";
import type { TextField } from "../../primitives/fields";
import { FieldWrapper } from "./field-wrapper";
import {
	TextField as TextFieldWrapper,
	TextFieldInput,
} from "~/components/ui/text-field";
import type { SetStoreFunction } from "solid-js/store";
import type { InputFormData } from "../../primitives/form";

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
