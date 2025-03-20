import { createSignal, For, Show, createEffect, createMemo, type Accessor } from "solid-js";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@client/components/ui/dialog";
import { Button } from "@client/components/ui/button";
import type { StepGraphNode } from "../primitives/form";
import { ConditionalLogic } from "../primitives/conditions";
import type { Edges } from "../primitives/edges";
import { useFormBuilder } from "../form-builder-context";

interface ConnectionEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceStep: StepGraphNode;
  availableSteps: StepGraphNode[];
  onSave: (edges: Edges) => void;
}

export function ConnectionEditorModal(props: ConnectionEditorModalProps) {
  const [edges, setEdges] = createSignal<Edges>(props.sourceStep.edges);

  const handleSave = () => {
    props.onSave(edges());
    props.onOpenChange(false);
  };

  const actions = createMemo(() => props.availableSteps.map(step => ({
    id: step.step.id,
    name: `Go to step: ${step.step.label}`,
    value: 'goToStep'
  })));

  const formValues = createMemo(() => props.sourceStep.blocks.flatMap(block => 
    block.children
      .filter(child => child.childType === 'field')
      .map(child => ({
        id: child.id,
        label: child.label,
        value: child.name
      }))
  ));
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Connections for {props.sourceStep.step.label}</DialogTitle>
        </DialogHeader>
        
       <ConditionalLogic
         formValues={formValues()}
         actions={actions()}
         onChange={setEdges}
         rules={edges}
       />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Connections
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
