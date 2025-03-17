import type { TextField } from "../primitives/fields";
import { FieldWrapper } from "./field-wrapper";
import { TextField as TextFieldWrapper, TextFieldInput } from "~/components/ui/text-field";

interface TextFieldProps {
  child: TextField;
  blockId: string;
}

export function TextField(props: TextFieldProps) {
  return (
    <FieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
    >
      <TextFieldWrapper>
        <TextFieldInput placeholder={props.child.placeholder || "Enter text..."}
        />
      </TextFieldWrapper>
    </FieldWrapper>
  );
}
