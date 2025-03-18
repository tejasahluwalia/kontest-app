import { For, type Component } from "solid-js";
import type { RadioField } from "../../primitives/fields";
import { BuilderFieldWrapper } from "../builder-field-wrapper";

interface BuilderRadioFieldProps {
  child: RadioField;
  blockId: string;
  stepId: string;
}

export const BuilderRadioField: Component<BuilderRadioFieldProps> = (props) => {
  return (
    <BuilderFieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      stepId={props.stepId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
      fieldType="Radio"
    >
      <div class="space-y-2">
        <For each={props.child.options}>
          {(option) => (
            <div class="flex items-center space-x-2">
              <div class="h-4 w-4 rounded-full border border-muted bg-background" />
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
