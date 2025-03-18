import type { Component } from "solid-js";
import type { RichTextField } from "../../primitives/fields";
import { BuilderFieldWrapper } from "../builder-field-wrapper";

interface BuilderTextAreaFieldProps {
  child: RichTextField;
  blockId: string;
  stepId: string;
}

export const BuilderTextAreaField: Component<BuilderTextAreaFieldProps> = (props) => {
  return (
    <BuilderFieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      stepId={props.stepId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
      fieldType="Rich Text"
    >
    </BuilderFieldWrapper>
  );
};
