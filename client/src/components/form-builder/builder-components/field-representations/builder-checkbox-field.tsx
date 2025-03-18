import { For, type Component } from "solid-js";
import type { CheckboxField } from "../../primitives/fields";
import { BuilderFieldWrapper } from "../builder-field-wrapper";

interface BuilderCheckboxFieldProps {
  child: CheckboxField;
  blockId: string;
  stepId: string;
}

export const BuilderCheckboxField: Component<BuilderCheckboxFieldProps> = (props) => {
  return (
    <BuilderFieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      stepId={props.stepId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
      fieldType="Checkbox"
    >
      <div class="space-y-2">
        <For each={props.child.options}>
          {(option) => (
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 rounded border border-muted bg-background" />
              <span class="text-sm text-muted-foreground">{option.label}</span>
            </div>
          )}
        </For>
        {props.child.options.length === 0 && (
          <div class="text-xs text-muted-foreground italic">No options defined</div>
        )}
      </div>
    </BuilderFieldWrapper>
  );
};
