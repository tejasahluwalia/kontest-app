import { For } from "solid-js";
import type { FormField } from "../types";
import { FieldWrapper } from "./field-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

interface CheckboxFieldProps {
  field: FormField;
  sectionId: string;
  isDragging?: boolean;
}

export function CheckboxField(props: CheckboxFieldProps) {
  return (
    <FieldWrapper
      fieldId={props.field.id}
      sectionId={props.sectionId}
      label={props.field.label}
      helpText={props.field.helpText}
      required={props.field.required}
      isDragging={props.isDragging}
    >
      <div class="space-y-2">
        <For each={props.field.options || []}>
          {(option) => (
            <div class="flex items-center space-x-2">
              <Checkbox id={option.id} disabled />
              <Label for={option.id}>{option.label}</Label>
            </div>
          )}
        </For>
      </div>
    </FieldWrapper>
  );
}
