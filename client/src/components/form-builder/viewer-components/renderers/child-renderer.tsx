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
}

const ChildRenderer: Component<ChildRendererProps> = (props) => {
  const { setSelectedChildId, setSelectedBlockId, setSelectedStepId } = useFormBuilder();
  const { child, blockId, stepId } = props;
  const { id } = child;

  return (
    <Switch>
      <Match when={child.childType === "field"}>
        <FieldRenderer child={child as InputField} blockId={blockId} stepId={stepId} />
      </Match>
      <Match when={child.childType === "display"}>
        <div 
          class="border border-dashed p-4 rounded-md" 
          onClick={() => batch(() => {setSelectedStepId(stepId); setSelectedBlockId(blockId); setSelectedChildId(id);})}
        >
          <p class="text-muted-foreground">Display component: {id}</p>
          <p class="text-sm text-muted-foreground">This display type is not implemented yet</p>
        </div>
      </Match>
    </Switch>
  );
};

export default ChildRenderer;