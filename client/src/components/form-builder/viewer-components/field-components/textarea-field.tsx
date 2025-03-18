import type { RichTextField } from "../../primitives/fields";
import { FieldWrapper } from "./field-wrapper";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";

interface TextareaFieldProps {
  child: RichTextField;
  blockId: string;
  stepId: string;
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
