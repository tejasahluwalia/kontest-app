import { For, type Component } from "solid-js";
import type { SelectField } from "../../primitives/fields";
import { BuilderFieldWrapper } from "../builder-field-wrapper";

interface BuilderSelectFieldProps {
  child: SelectField;
  blockId: string;
  stepId: string;
}

export const BuilderSelectField: Component<BuilderSelectFieldProps> = (props) => {
  return (
    <BuilderFieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      stepId={props.stepId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
      fieldType="Select"
    >
      <div class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm cursor-default flex items-center justify-between">
        <span>{props.child.placeholder || "Select an option"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
      
      <div class="mt-1 text-xs text-muted-foreground">
        <For each={props.child.options}>
          {(option) => (
            <div class="px-2 py-1 border-b border-muted last:border-0">
              {option.label}
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
