import type { Component } from "solid-js";
import type { TextField as TextFieldType } from "../../primitives/fields";
import { BuilderFieldWrapper } from "../builder-field-wrapper";

interface BuilderTextFieldProps {
  child: TextFieldType;
  blockId: string;
  stepId: string;
}

export const BuilderTextField: Component<BuilderTextFieldProps> = (props) => {
  return (
    <BuilderFieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      stepId={props.stepId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
      fieldType="Text"
    >
      <div class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm cursor-default">
        {props.child.placeholder || "Text input"}
      </div>
    </BuilderFieldWrapper>
  );
};
