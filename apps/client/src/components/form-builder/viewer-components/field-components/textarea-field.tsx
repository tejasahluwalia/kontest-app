import type { StoreSetter } from "solid-js";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";
import type { RichTextField } from "../../primitives/fields";
import type { InputFormData } from "../../primitives/form";
import { FieldWrapper } from "./field-wrapper";

interface TextareaFieldProps {
	child: RichTextField;
	blockId: string;
	stepId: string;
	formData?: InputFormData;
	updateFormData?: StoreSetter<InputFormData>;
}

export function TextAreaField(props: TextareaFieldProps) {
	return (
		<FieldWrapper
			childId={props.child.id}
			blockId={props.blockId}
			stepId={props.stepId}
			label={props.child.label}
			helpText={props.child.helpText}
			required={props.child.required}
		>
			<TextField>
				<TextFieldTextArea
					placeholder={props.child.placeholder || "Enter text..."}
					disabled
				/>
			</TextField>
		</FieldWrapper>
	);
}
