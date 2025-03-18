import { For } from "solid-js";
import type { CheckboxField } from "../../primitives/fields";
import { FieldWrapper } from "./field-wrapper";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

interface CheckboxFieldProps {
  child: CheckboxField;
  blockId: string;
  stepId: string;
}

export function CheckboxField(props: CheckboxFieldProps) {
  return (
    <FieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      stepId={props.stepId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
    >
      <div class="space-y-2">
        <For each={props.child.options || []}>
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
