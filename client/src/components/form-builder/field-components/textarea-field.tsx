import type { FormField } from "../types";
import { FieldWrapper } from "./field-wrapper";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";

interface TextareaFieldProps {
  field: FormField;
  sectionId: string;
  isDragging?: boolean;
}

export function TextAreaField(props: TextareaFieldProps) {
  return (
    <FieldWrapper
      fieldId={props.field.id}
      sectionId={props.sectionId}
      label={props.field.label}
      helpText={props.field.helpText}
      required={props.field.required}
      isDragging={props.isDragging}
    >
      <TextField>
        <TextFieldTextArea
          placeholder={props.field.placeholder || "Enter text..."}
          disabled
        />
      </TextField>
    </FieldWrapper>
  );
}
