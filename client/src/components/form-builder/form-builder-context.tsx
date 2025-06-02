import CallContext from "@client/context/call";
import OrgContext from "@client/context/org";
import server from "@client/lib/server-api";
import { nanoid } from "nanoid";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
  type ParentComponent,
} from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import { showToast } from "../ui/toast";
import {
  addHistoryEntry,
  createInitialHistory,
} from "./history/history-manager";
import { appendBlock, type Block } from "./primitives/blocks";
import { type Child } from "./primitives/children";
import type { ConditionalRule } from "./primitives/conditions";
import {
  type FormBuilderHistory,
  type FormSchema,
  type InputFormData,
  type StepGraphNode,
} from "./primitives/form";
import type { InputField } from "./primitives/fields";
import type { FormBuilderUIState } from "./state/ui-state";
import { createInitialUIState } from "./state/ui-state";

// Define the operations we can perform on the form builder
interface FormBuilderContextType {
  // Form data access
  formSchema: FormSchema;
  uiState: FormBuilderUIState;
  history: FormBuilderHistory;

  // Step operations
  selectedStepId: Accessor<string>;
  setSelectedStepId: (stepId: string) => void;
  selectedStep: Accessor<StepGraphNode | undefined>;
  addStepToGraph: (step: StepGraphNode) => void;
  removeStepFromGraph: (stepId: string) => void;
  updateStepInGraph: (stepId: string, data: Partial<StepGraphNode>) => void;

  // Block operations
  setSelectedBlockId: (blockId: string) => void;
  selectedBlockId: Accessor<string>;
  selectedBlock: Accessor<Block | undefined>;
  addBlockToStep: (block: Block, stepId: string) => void;
  removeBlockFromStep: (blockId: string, stepId: string) => void;
  updateBlockInStep: (
    blockId: string,
    data: Partial<Block>,
    stepId: string,
  ) => void;

  // Child operations
  setSelectedChildId: (childId: string) => void;
  selectedChildId: Accessor<string>;
  selectedChild: Accessor<Child | undefined>;
  addChildToBlock: (child: Child, blockId: string, stepId: string) => void;
  removeChildFromBlock: (
    childId: string,
    blockId: string,
    stepId: string,
  ) => void;
  updateChildInBlock: (
    childId: string,
    blockId: string,
    data: Partial<Child>,
    stepId: string,
  ) => void;
  // moveChild: (childId: string, newParentId: string, index?: number) => void;
  // duplicateChild: (childId: string) => string;

  // Edge operations
  addEdgeToStep: (edge: ConditionalRule, stepId: string) => void;
  removeEdgeFromStep: (edgeId: string, stepId: string) => void;
  updateEdgeInStep: (
    edgeId: string,
    stepId: string,
    data: Partial<ConditionalRule>,
  ) => void;

  // // Template operations
  // addTemplate: (name: string, block: Block) => string;
  // updateTemplate: (templateId: string, data: Partial<Block>) => void;
  // removeTemplate: (templateId: string) => void;
  // getTemplate: (templateId: string) => Block | null;
  // useTemplateInBlock: (block: Block, templateId: string) => string;

  // Form operations
  updateFormSettings: (
    data: Partial<Omit<FormSchema, "flow" | "templates">>,
  ) => void;
  saveForm: () => Promise<boolean>;

  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: Accessor<boolean>;
  canRedo: Accessor<boolean>;

  // Preview operations
  startPreview: () => void;
  stopPreview: () => void;
  updatePreviewData: (data: InputFormData) => void;
  isPreviewMode: Accessor<boolean>;
  previewData: Accessor<InputFormData>;
}

const AUTOSAVE_DELAY = 3000; // 3 seconds

const FormBuilderContext = createContext<FormBuilderContextType>();

export const FormBuilderProvider: ParentComponent<{
  initialSchema: FormSchema;
}> = (props) => {
  // Initialize the state with defaults or provided schema
  const [formSchema, setFormSchema] = createStore<FormSchema>(
    props.initialSchema,
  );

  const [uiState, setUIState] = createStore<FormBuilderUIState>(
    createInitialUIState(),
  );
  const [history, setHistory] = createStore<FormBuilderHistory>(
    createInitialHistory(props.initialSchema),
  );

  const [selectedStepId, setSelectedStepId] = createSignal<string>(
    props.initialSchema.graph[0].step.id,
  );
  const [selectedBlockId, setSelectedBlockId] = createSignal<string>(
    props.initialSchema.graph[0].blocks[0].id,
  );
  const [selectedChildId, setSelectedChildId] = createSignal<string>(
    props.initialSchema.graph[0].blocks.find(
      (block) => block.id === selectedBlockId(),
    )?.children[0]?.id || "",
  );

  const selectedStep = createMemo(() =>
    formSchema.graph.find((node) => node.step.id === selectedStepId()),
  );
  const selectedBlock = createMemo(() =>
    selectedStep()?.blocks.find((block) => block.id === selectedBlockId()),
  );
  const selectedChild = createMemo(() =>
    selectedBlock()?.children.find((child) => child.id === selectedChildId()),
  );

  // History tracking and management
  const saveToHistory = () => {
    setHistory(
      produce((draft) => {
        const updatedHistory = addHistoryEntry(draft, formSchema);
        draft.past = updatedHistory.past;
        draft.future = [];
      }),
    );
  };

  // History operations
  const undo = () => {
    if (history.past.length === 0) return;

    const newPast = [...history.past];
    const lastState = newPast.pop();

    if (lastState) {
      setHistory(
        produce((draft) => {
          draft.past = newPast;
          draft.future = [formSchema, ...draft.future];
        }),
      );

      setFormSchema(reconcile(lastState));
    }
  };

  const redo = () => {
    if (history.future.length === 0) return;

    const newFuture = [...history.future];
    const nextState = newFuture.shift();

    if (nextState) {
      setHistory(
        produce((draft) => {
          draft.past = [...draft.past, formSchema];
          draft.future = newFuture;
        }),
      );

      setFormSchema(reconcile(nextState));
    }
  };

  const canUndo = () => history.past.length > 0;
  const canRedo = () => history.future.length > 0;

  const org = useContext(OrgContext);
  const call = useContext(CallContext);

  if (!call || !org) {
    throw new Error("Call or Org not found");
  }

  const saveForm = async () => {
    try {
      setUIState("isSaving", true);

      // Update the version and timestamps
      setFormSchema(
        produce((draft) => {
          draft.version += 1;
          draft.updatedAt = new Date().toISOString();
        }),
      );

      const { data, error, status } = await server.api
        .orgs({ orgSlug: org.slug })
        .calls({ callSlug: call.slug })
        .update.post(
          {
            id: call.id,
            name: call.name,
            slug: call.slug,
            orgId: call.orgId,
            schema: formSchema,
          },
          {
            query: {
              callId: call.id,
              orgId: org.id,
            },
          },
        );

      if (error) {
        showToast({
          title: "Error",
          description: JSON.stringify(error.value),
          variant: "destructive",
        });
        return false;
      }

      if (status !== 200) {
        showToast({
          title: "Error",
          description: `Failed to save form: ${status}`,
          variant: "destructive",
        });
        return false;
      }

      if (!data) {
        showToast({
          title: "Error",
          description: "Failed to save form",
          variant: "destructive",
        });
        return false;
      }

      // showToast({
      //   title: 'Success',
      //   description: 'Form saved successfully',
      //   variant: 'default'
      // });

      // Set last saved timestamp
      setUIState("lastSaved", new Date().toISOString());

      // Here you would implement the actual API call to save the form
      // console.log('Form saved:', formSchema);

      return true;
    } catch (error) {
      console.error("Error saving form:", error);
      return false;
    } finally {
      setUIState("isSaving", false);
    }
  };

  // Step operations
  const addStepToGraph = (stepGraphNode: StepGraphNode) => {
    saveToHistory();
    setFormSchema("graph", formSchema.graph.length, stepGraphNode);
  };

  const removeStepFromGraph = (stepId: string): void => {
    saveToHistory();
    const step = formSchema.graph.find((node) => node.step.id == stepId);
    if (!step) throw new Error("Step not found");
    setFormSchema(
      "graph",
      formSchema.graph.filter((node) => node.step.id !== stepId),
    );
  };

  const updateStepInGraph = (
    stepId: string,
    data: Partial<StepGraphNode>,
  ): void => {
    saveToHistory();
    const step = formSchema.graph.find((node) => node.step.id == stepId);
    if (!step) throw new Error("Step not found");
    const newStep = { ...step, ...data };
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "step",
      newStep.step,
    );
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "edges",
      newStep.edges,
    );
  };

  // Block operations
  const addBlockToStep = (block: Block, stepId: string): void => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "blocks",
      node.blocks.length,
      block,
    );
  };

  const removeBlockFromStep = (blockId: string, stepId: string): void => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    const newBlocks = node.blocks.filter((block) => block.id !== blockId);
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "blocks",
      reconcile(newBlocks),
    );
  };

  const updateBlockInStep = (
    blockId: string,
    data: Partial<Block>,
    stepId: string,
  ): void => {
    saveToHistory();
    const node = formSchema.graph.find(
      (node) => node.step.id == (stepId ?? selectedStepId()),
    );
    if (!node) throw new Error("Step not found");
    const newBlocks = node.blocks.map((block) =>
      block.id === blockId ? { ...block, ...data } : block,
    );
    setFormSchema(
      "graph",
      (node) => node.step.id === (stepId ?? selectedStepId()),
      "blocks",
      reconcile(newBlocks),
    );
  };

  const duplicateBlock = (blockId: string, stepId: string): void => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    const block = node.blocks.find((block) => block.id === blockId);
    if (!block) throw new Error("Block not found");
    const newBlocks = appendBlock(node.blocks, { ...block, id: nanoid() });
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "blocks",
      reconcile(newBlocks),
    );
  };

  const addChildToBlock = (
    child: Child,
    blockId: string,
    stepId: string,
  ): void => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    const block = node.blocks.find((block) => block.id === blockId);
    if (!block) throw new Error("Block not found");
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "blocks",
      (b) => b.id === blockId,
      "children",
      block.children.length,
      child,
    );
  };

  const removeChildFromBlock = (
    childId: string,
    blockId: string,
    stepId: string,
  ): void => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    const block = node.blocks.find((block) => block.id === blockId);
    if (!block) throw new Error("Block not found");
    const newChildren = block.children.filter((child) => child.id !== childId);
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "blocks",
      (b) => b.id === blockId,
      "children",
      reconcile(newChildren),
    );
  };

  const updateChildInBlock = (
    childId: string,
    blockId: string,
    data: Partial<Child>,
    stepId: string,
  ): void => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    const block = node.blocks.find((block) => block.id === blockId);
    if (!block) throw new Error("Block not found");
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "blocks",
      (b) => b.id === blockId,
      "children",
      (c) => c.id === childId,
      data,
    );
  };

  // Update form settings
  const updateFormSettings = (
    data: Partial<Omit<FormSchema, "flow" | "templates">>,
  ) => {
    saveToHistory();

    setFormSchema(
      produce((draft) => {
        Object.assign(draft, data);
        draft.updatedAt = new Date().toISOString();
      }),
    );
  };

  const addEdgeToStep = (edge: ConditionalRule, stepId: string) => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "edges",
      node.edges.length,
      edge,
    );
  };

  const removeEdgeFromStep = (edgeId: string, stepId: string) => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    const newEdges = node.edges.filter((edge) => edge.id !== edgeId);
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "edges",
      reconcile(newEdges),
    );
  };

  const updateEdgeInStep = (
    edgeId: string,
    stepId: string,
    data: Partial<ConditionalRule>,
  ) => {
    saveToHistory();
    const node = formSchema.graph.find((node) => node.step.id == stepId);
    if (!node) throw new Error("Step not found");
    setFormSchema(
      "graph",
      (node) => node.step.id === stepId,
      "edges",
      (e) => e.id === edgeId,
      data,
    );
  };

  // Initialize an empty form data object with the structure matching the form schema
  const initialFormInputData = (): InputFormData => {
    const data: InputFormData = {};
    
    // Iterate through each step in the graph
    formSchema.graph.forEach((node) => {
      const stepId = node.step.id;
      data[stepId] = {};
      
      // Iterate through each block in the step
      node.blocks.forEach((block) => {
        const blockId = block.id;
        data[stepId][blockId] = {};
        
        // Iterate through each child in the block
        block.children.forEach((child) => {
          // Only add fields (not display components)
          if (child.childType === 'field') {
            const field = child as InputField;
            data[stepId][blockId][field.id] = {
              label: field.label,
              fieldType: field.fieldType,
              value: field.defaultValue !== undefined ? field.defaultValue : ''
            };
          }
        });
      });
    });
    
    return data;
  };

  // Preview operations
  const startPreview = () => {
    setUIState(
      produce((draft) => {
        draft.preview.active = true;
        draft.preview.formData = initialFormInputData();
        draft.preview.validationErrors = {};
        draft.preview.submitting = false;
      }),
    );
  };

  const stopPreview = () => {
    setUIState(
      produce((draft) => {
        draft.preview.active = false;
      }),
    );
  };

  const updatePreviewData = (data: InputFormData) => {
    setUIState(
      produce((draft) => {
        draft.preview.formData = data;
      }),
    );
  };

  const isPreviewMode = () => uiState.preview.active;
  const previewData = () => uiState.preview.formData;

  const contextValue: FormBuilderContextType = {
    // Schema state
    formSchema,
    uiState,
    history,

    // Step operations
    setSelectedStepId,
    selectedStepId,
    selectedStep,
    addStepToGraph,
    removeStepFromGraph,
    updateStepInGraph,

    // Block operations
    setSelectedBlockId,
    selectedBlockId,
    selectedBlock,
    addBlockToStep,
    removeBlockFromStep,
    updateBlockInStep,

    // Child operations
    setSelectedChildId,
    selectedChildId,
    selectedChild,
    addChildToBlock,
    removeChildFromBlock,
    updateChildInBlock,
    // moveChildInBlock,
    // duplicateChildInBlock,

    // Edge operations
    addEdgeToStep,
    removeEdgeFromStep,
    updateEdgeInStep,

    // // Template operations
    // addTemplateToBlock,
    // updateTemplate,
    // removeTemplate,
    // useTemplate,

    // Form operations
    updateFormSettings,
    saveForm,

    // History operations
    undo,
    redo,
    canUndo,
    canRedo,

    // Preview operations
    startPreview,
    stopPreview,
    updatePreviewData,
    isPreviewMode,
    previewData,
  };

  return (
    <FormBuilderContext.Provider value={contextValue}>
      {props.children}
    </FormBuilderContext.Provider>
  );
};

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
}
