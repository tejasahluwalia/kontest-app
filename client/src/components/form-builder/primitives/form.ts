import { createId } from "@paralleldrive/cuid2";
import { createBlocks, type Block, type Blocks, type BlockTemplate } from "./blocks";
import { nanoid } from "nanoid";
import { createEdge, type Edges } from "./edges";

type Step = {
    id: string;
    label: string;
    description?: string;
    nextButtonLabel?: string;
    previousButtonLabel?: string;
    showProgressBar?: boolean;
    validate: (data: Step) => boolean;  // Step-specific validation logic
};

type StepGraphNode = { step: Step; blocks: Blocks; edges: Edges };

// Graph structure
type FormGraph = {[key: string]: StepGraphNode}

// Create an empty form flow graph
const createDefaultFormGraph = (stepId?: string): FormGraph => {
    const id = stepId || createId();
    return {
        [id]: {
            step: {
                id,
                label: 'Step 1',
                nextButtonLabel: 'Next',
                previousButtonLabel: 'Previous',
                showProgressBar: true,
                validate: () => true
            },
            blocks: createBlocks(),
            edges: [createEdge()]
        }
    };
};

const createGraphFromStep = (step: Step): FormGraph => {
    return {
        [step.id]: {
            step,
            blocks: createBlocks(),
            edges: [createEdge()]
        }
    };
};

// Add a form step (node)
const addStep = (
    graph: FormGraph,
    step: Step
): FormGraph => {
    if (graph[step.id]) return graph;
    graph[step.id] = { step, blocks: createBlocks(), edges: [createEdge()] };
    return graph;
};

interface FormDiff {
    type: 'add' | 'update' | 'delete';
    path: string;
    oldValue?: any;
    newValue?: any;
}

interface FormVersion {
    version: number;
    timestamp: string;
    changes: FormDiff[];
    snapshot: FormGraph;
}

interface FormSchema {
    id: string;
    name: string;
    description: string;
    rules?: string;
    eligibility?: string;
    graph: FormGraph;
    templates: BlockTemplate[];
    version: number;
    createdAt: string;
    updatedAt: string;
}

interface FormBuilderHistory {
    past: FormSchema[];
    future: FormSchema[];
}

function createDefaultFormSchema(): FormSchema {
    const id = createId();
    const graph = createDefaultFormGraph();
    return {
        id,
        name: 'New Form',
        description: 'A new form',
        rules: '',
        eligibility: '',
        graph,
        templates: [],
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}


export {
    type FormGraph,
    type Step,
    type FormSchema,
    type FormBuilderHistory,
    type FormVersion,
    type StepGraphNode,
    createDefaultFormGraph, createGraphFromStep, addStep, createDefaultFormSchema
};