import { createContext, createSignal, createEffect, onCleanup, useContext, type Accessor, type ParentComponent } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import type { FormBuilderUIState } from './state/ui-state';
import { createDefaultFormSchema, type FormBuilderHistory, type FormSchema, type Step } from "./primitives/form";
import { createInitialUIState } from './state/ui-state';
import {
  createInitialHistory,
  addHistoryEntry,
} from './history/history-manager';
import { appendBlock, type Block } from "./primitives/blocks";
import type { Child } from "./primitives/children";
import { createId } from "@paralleldrive/cuid2";

// Define the operations we can perform on the form builder
interface FormBuilderContextType {
  // Form data access
  formSchema: FormSchema;
  uiState: FormBuilderUIState;
  history: FormBuilderHistory;

  // Step operations
  selectedStepId: Accessor<string>;
  setSelectedStepId: (stepId: string) => void;
  // addStep: (step: Step) => string;
  // removeStep: (stepId: string) => void;
  // updateStep: (stepId: string, data: Partial<Step>) => void;

  // Block operations
  setSelectedBlockId: (blockId: string) => void;
  selectedBlockId: Accessor<string>;
  addBlockToStep: (block: Block, stepId?: string) => void;
  removeBlockFromStep: (blockId: string, stepId?: string) => void;
  updateBlock: (blockId: string, data: Partial<Block>) => void;

  // Child operations
  setSelectedChildId: (childId: string) => void;
  selectedChildId: Accessor<string>;
  // addChildToChildren: (child: Child) => string;
  // removeChild: (block: Block, childId: string) => void;
  // moveChild: (block: Block, childId: string, newParentId: string, index?: number) => void;
  // duplicateChild: (block: Block, childId: string) => string;

  // // Template operations
  // addTemplate: (name: string, block: Block) => string;
  // updateTemplate: (templateId: string, data: Partial<Block>) => void;
  // removeTemplate: (templateId: string) => void;
  // getTemplate: (templateId: string) => Block | null;
  // useTemplateInBlock: (block: Block, templateId: string) => string;

  // Form operations
  updateFormSettings: (data: Partial<Omit<FormSchema, 'flow' | 'templates'>>) => void;
  saveForm: () => Promise<boolean>;

  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: Accessor<boolean>;
  canRedo: Accessor<boolean>;

  // Preview operations
  startPreview: () => void;
  stopPreview: () => void;
  updatePreviewData: (data: Record<string, any>) => void;
  isPreviewMode: Accessor<boolean>;
  previewData: Accessor<Record<string, any>>;
}

const AUTOSAVE_DELAY = 3000; // 3 seconds

const FormBuilderContext = createContext<FormBuilderContextType>();

export const FormBuilderProvider: ParentComponent<{ initialSchema: FormSchema }> = (props) => {
  // Initialize the state with defaults or provided schema
  const [formSchema, setFormSchema] = createStore<FormSchema>(props.initialSchema);

  const [uiState, setUIState] = createStore<FormBuilderUIState>(createInitialUIState());
  const [history, setHistory] = createStore<FormBuilderHistory>(createInitialHistory(props.initialSchema));

  const [selectedStepId, setSelectedStepId] = createSignal<string>(props.initialSchema.graph[Object.keys(props.initialSchema.graph)[0]].step.id);
  const [selectedBlockId, setSelectedBlockId] = createSignal<string>(props.initialSchema.graph[selectedStepId()].step.blocks[0].id);
  const [selectedChildId, setSelectedChildId] = createSignal<string>(props.initialSchema.graph[selectedStepId()].step.blocks.find(block => block.id === selectedBlockId())?.children[0]?.id || '');


  // History tracking and management
  const saveToHistory = () => {
    setHistory(produce(draft => {
      const updatedHistory = addHistoryEntry(draft, formSchema);
      draft.past = updatedHistory.past;
      draft.future = [];
    }));
  };

  // History operations
  const undo = () => {
    if (history.past.length === 0) return;

    const newPast = [...history.past];
    const lastState = newPast.pop();

    if (lastState) {
      setHistory(produce(draft => {
        draft.past = newPast;
        draft.future = [formSchema, ...draft.future];
      }));

      setFormSchema(reconcile(lastState));
    }
  };

  const redo = () => {
    if (history.future.length === 0) return;

    const newFuture = [...history.future];
    const nextState = newFuture.shift();

    if (nextState) {
      setHistory(produce(draft => {
        draft.past = [...draft.past, formSchema];
        draft.future = newFuture;
      }));

      setFormSchema(reconcile(nextState));
    }
  };

  const canUndo = () => history.past.length > 0;
  const canRedo = () => history.future.length > 0;

  // Setup autosave
  let autosaveTimeout: number | undefined;

  const saveForm = async () => {
    try {
      setUIState("isSaving", true);

      // Update the version and timestamps
      setFormSchema(produce(draft => {
        draft.version += 1;
        draft.updatedAt = new Date().toISOString();
      }));

      // Simulate saving to server
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set last saved timestamp
      setUIState("lastSaved", new Date().toISOString());

      // Here you would implement the actual API call to save the form
      console.log('Form saved:', formSchema);

      return true;
    } catch (error) {
      console.error('Error saving form:', error);
      return false;
    } finally {
      setUIState("isSaving", false);
    }
  };

  // Schedule autosave when form changes
  createEffect(() => {
    // Deep watch formSchema
    const _ = JSON.stringify(formSchema);

    // Clear existing timeout
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }

    // Schedule new save
    autosaveTimeout = setTimeout(() => {
      saveForm();
    }, AUTOSAVE_DELAY) as unknown as number;
  });

  // Clean up timeout when component unmounts
  onCleanup(() => {
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }
  });

  // Block operations
  const addBlockToStep = (block: Block, stepId?: string): void => {
    saveToHistory();
    const step = formSchema.graph[stepId ?? selectedStepId()].step;
    if (!step) throw new Error('Step not found');
    const newBlocks = appendBlock(step.blocks, block);
    setFormSchema("graph", step.id, "step", "blocks", reconcile(newBlocks));
  };

  const removeBlockFromStep = (blockId: string, stepId?: string): void => {
    saveToHistory();
    const step = formSchema.graph[stepId ?? selectedStepId()].step;
    if (!step) throw new Error('Step not found');
    const newBlocks = step.blocks.filter(block => block.id !== blockId);
    setFormSchema("graph", step.id, "step", "blocks", reconcile(newBlocks));
  };

  const updateBlock = (blockId: string, data: Partial<Block>): void => {
    saveToHistory();
    const step = formSchema.graph[selectedStepId()].step;
    if (!step) throw new Error('Step not found');
    const newBlocks = step.blocks.map(block =>
      block.id === blockId ? { ...block, ...data } : block
    );
    setFormSchema("graph", step.id, "step", "blocks", reconcile(newBlocks));
  };

  const duplicateBlock = (blockId: string): void => {
    saveToHistory();
    const step = formSchema.graph[selectedStepId()].step;
    if (!step) throw new Error('Step not found');
    const block = step.blocks.find(block => block.id === blockId);
    if (!block) throw new Error('Block not found');
    const newBlocks = appendBlock(step.blocks, { ...block, id: createId() });
    setFormSchema("graph", step.id, "step", "blocks", reconcile(newBlocks));
  };

  // Update form settings
  const updateFormSettings = (data: Partial<Omit<FormSchema, 'flow' | 'templates'>>) => {
    saveToHistory();

    setFormSchema(produce(draft => {
      Object.assign(draft, data);
      draft.updatedAt = new Date().toISOString();
    }));
  };

  // Preview operations
  const startPreview = () => {
    setUIState(produce(draft => {
      draft.preview.active = true;
      draft.preview.formData = {};
      draft.preview.validationErrors = {};
      draft.preview.submitting = false;
    }));
  };

  const stopPreview = () => {
    setUIState(produce(draft => {
      draft.preview.active = false;
    }));
  };

  const updatePreviewData = (data: Record<string, any>) => {
    setUIState(produce(draft => {
      draft.preview.formData = { ...draft.preview.formData, ...data };
    }));
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
    // addStep,
    // removeStep,
    // updateStep,

    // Block operations
    setSelectedBlockId,
    selectedBlockId,
    addBlockToStep,
    removeBlockFromStep,
    updateBlock,

    // Child operations
    setSelectedChildId,
    selectedChildId,
    // addChildToBlock,
    // removeChildFromBlock,
    // moveChildInBlock,
    // duplicateChildInBlock,

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
    previewData
  };

  return (
    <FormBuilderContext.Provider value={contextValue}>
      {props.children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
}
