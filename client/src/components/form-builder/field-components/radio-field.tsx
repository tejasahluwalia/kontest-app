import { For } from "solid-js";
import type { FormField } from "../types";
import { FieldWrapper } from "./field-wrapper";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";

interface RadioFieldProps {
  field: FormField;
  sectionId: string;
  isDragging?: boolean;
}

export function RadioField(props: RadioFieldProps) {
  return (
    <FieldWrapper
      fieldId={props.field.id}
      sectionId={props.sectionId}
      label={props.field.label}
      helpText={props.field.helpText}
      required={props.field.required}
      isDragging={props.isDragging}
    >
      <RadioGroup disabled>
        <For each={props.field.options || []}>
          {(option) => (
            <div class="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.id} />
              <Label for={option.id}>{option.label}</Label>
            </div>
          )}
        </For>
      </RadioGroup>
    </FieldWrapper>
  );
}
