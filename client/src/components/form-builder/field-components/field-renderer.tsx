import { Match, Switch } from "solid-js";
import type { FormField } from "../types";
import { TextField } from "./text-field";
import { TextAreaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { CheckboxField } from "./checkbox-field";
import { RadioField } from "./radio-field";

interface FieldRendererProps {
  field: FormField;
  sectionId: string;
  isDragging?: boolean;
}

export function FieldRenderer(props: FieldRendererProps) {
  return (
    <Switch>
      <Match when={props.field.type === "text"}>
        <TextField field={props.field} sectionId={props.sectionId} isDragging={props.isDragging} />
      </Match>
      <Match when={props.field.type === "textarea"}>
        <TextAreaField field={props.field} sectionId={props.sectionId} isDragging={props.isDragging} />
      </Match>
      <Match when={props.field.type === "select" || props.field.type === "multiselect"}>
        <SelectField field={props.field} sectionId={props.sectionId} isDragging={props.isDragging} />
      </Match>
      <Match when={props.field.type === "checkbox"}>
        <CheckboxField field={props.field} sectionId={props.sectionId} isDragging={props.isDragging} />
      </Match>
      <Match when={props.field.type === "radio"}>
        <RadioField field={props.field} sectionId={props.sectionId} isDragging={props.isDragging} />
      </Match>
      <Match when={true}>
        <div class="p-4 border border-dashed rounded-md">
          <p class="text-muted-foreground">Field type "{props.field.type}" not implemented yet</p>
        </div>
      </Match>
    </Switch>
  );
}
