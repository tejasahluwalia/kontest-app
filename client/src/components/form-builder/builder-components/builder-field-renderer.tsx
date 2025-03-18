import { Match, Switch, type Component } from "solid-js";
import type { InputField } from "../primitives/fields";
import { BuilderTextField } from "./field-representations/builder-text-field";
import { BuilderTextAreaField } from "./field-representations/builder-textarea-field";
import { BuilderSelectField } from "./field-representations/builder-select-field";
import { BuilderCheckboxField } from "./field-representations/builder-checkbox-field";
import { BuilderRadioField } from "./field-representations/builder-radio-field";
import type { TextField as TextFieldType, RichTextField as RichTextFieldType, SelectField as SelectFieldType, CheckboxField as CheckboxFieldType, RadioField as RadioFieldType } from "../primitives/fields";

interface BuilderFieldRendererProps {
  child: InputField;
  blockId: string;
  stepId: string;
}

export const BuilderFieldRenderer: Component<BuilderFieldRendererProps> = (props) => {
  return (
    <Switch>
      <Match when={props.child.fieldType === "text"}>
        <BuilderTextField child={props.child as TextFieldType} blockId={props.blockId} stepId={props.stepId} />
      </Match>
      <Match when={props.child.fieldType === "rich-text"}>
        <BuilderTextAreaField child={props.child as RichTextFieldType} blockId={props.blockId} stepId={props.stepId} />
      </Match>
      <Match when={props.child.fieldType === "select"}>
        <BuilderSelectField child={props.child as SelectFieldType} blockId={props.blockId} stepId={props.stepId} />
      </Match>
      <Match when={props.child.fieldType === "checkbox"}>
        <BuilderCheckboxField child={props.child as CheckboxFieldType} blockId={props.blockId} stepId={props.stepId} />
      </Match>
      <Match when={props.child.fieldType === "radio"}>
        <BuilderRadioField child={props.child as RadioFieldType} blockId={props.blockId} stepId={props.stepId} />
      </Match>
      <Match when={true}>
        <div class="p-4 border border-dashed rounded-md">
          <p class="text-muted-foreground">Field type "{props.child.fieldType}" not implemented yet</p>
        </div>
      </Match>
    </Switch>
  );
};
