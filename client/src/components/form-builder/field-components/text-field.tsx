import type { FormField } from "../types";
import { FieldWrapper } from "./field-wrapper";
import { TextField as TextFieldWrapper, TextFieldInput } from "~/components/ui/text-field";

interface TextFieldProps {
  field: FormField;
  sectionId: string;
  isDragging?: boolean;
}

export function TextField(props: TextFieldProps) {
  return (
    <FieldWrapper
      fieldId={props.field.id}
      sectionId={props.sectionId}
      label={props.field.label}
      helpText={props.field.helpText}
      required={props.field.required}
      isDragging={props.isDragging}
    >
      <TextFieldWrapper>
        <TextFieldInput placeholder={props.field.placeholder || "Enter text..."}
        />
      </TextFieldWrapper>
    </FieldWrapper>
  );
}
