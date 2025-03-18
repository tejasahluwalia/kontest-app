import { createId } from "@paralleldrive/cuid2";
import { createBlocks, type Block, type Blocks, type BlockTemplate } from "./blocks";
import { nanoid } from "nanoid";

type Step = {
    id: string;
    label: string;
    description?: string;
    nextButtonLabel?: string;
    previousButtonLabel?: string;
    showProgressBar?: boolean;
    validate: (data: Step) => boolean;  // Step-specific validation logic
};

// Edge type with a condition based on form data
type Edge = {
    to: string;
    condition: (data: Step) => boolean;
};

type StepGraphNode = { step: Step; blocks: Blocks; edges: Edge[] };

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
            edges: []
        }
    };
};

const createGraphFromStep = (step: Step): FormGraph => {
    return {
        [step.id]: {
            step,
            blocks: createBlocks(),
            edges: []
        }
    };
};

// Add a form step (node)
const addStep = (
    graph: FormGraph,
    step: Step
): FormGraph => {
    if (graph[step.id]) return graph;
    graph[step.id] = { step, blocks: createBlocks(), edges: [] };
    return graph;
};

// Add a conditional transition (edge)
const addTransition = (
    graph: FormGraph,
    from: string,
    to: string,
    condition: (data: Step) => boolean
): FormGraph => {
    if (!graph[from] || !graph[to]) {
        throw new Error(`Both steps must exist before adding a transition.`);
    }

    const newGraph = { ...graph };
    const node = newGraph[from];
    newGraph[from] = { ...node, edges: [...node.edges, { to, condition }] };

    return newGraph;
};

// Validate a form step
const validateStep = (
    graph: FormGraph,
    stepId: string,
    data: Step
): boolean => {
    const node = graph[stepId];
    if (!node) throw new Error(`Step "${stepId}" does not exist.`);
    return node.step.validate(data);
};

// Find the next valid step
const getNextStep = (
    graph: FormGraph,
    currentStep: string,
    data: Step
): string | null => {
    const node = graph[currentStep];
    if (!node) throw new Error(`Step "${currentStep}" does not exist.`);

    for (const edge of node.edges) {
        if (edge.condition(data)) {
            return edge.to;
        }
    }

    return null; // No valid next step found
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
    type Edge,
    type FormSchema,
    type FormBuilderHistory,
    type FormVersion,
    type StepGraphNode,
    createDefaultFormGraph, createGraphFromStep, addStep, addTransition, validateStep, getNextStep, createDefaultFormSchema
};