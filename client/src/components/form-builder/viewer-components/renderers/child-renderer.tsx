import { Switch, Match, type Component } from "solid-js";
import type { Child } from "../../primitives/children";
import type { InputField } from "../../primitives/fields";
import { useFormBuilder } from "../../form-builder-context";
import { FieldRenderer } from "../field-components/field-renderer";
import { batch } from "solid-js"

interface ChildRendererProps {
  child: Child;
  blockId: string;
  stepId: string;
  formData?: Record<string, any>;
  updateFormData?: (data: Record<string, any>) => void;
}

const ChildRenderer: Component<ChildRendererProps> = (props) => {
  const { child, blockId, stepId } = props;
  const { id } = child;

  return (
    <Switch>
      <Match when={child.childType === "field"}>
        <FieldRenderer 
          child={child as InputField} 
          blockId={blockId} 
          stepId={stepId} 
          formData={props.formData} 
          updateFormData={props.updateFormData} 
        />
      </Match>
      <Match when={child.childType === "display"}>
        <div 
          class="border border-dashed p-4 rounded-md" 
        >
          <p class="text-muted-foreground">Display component: {id}</p>
          <p class="text-sm text-muted-foreground">This display type is not implemented yet</p>
        </div>
      </Match>
    </Switch>
  );
};

export default ChildRenderer;