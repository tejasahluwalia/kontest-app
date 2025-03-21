import { createBlocks, type Block, type Blocks, type BlockTemplate } from "./blocks";
import { nanoid } from "nanoid";
import { createEdge, type Edges } from "./edges";

type Step = {
    id: string;
    label: string;
    description?: string;
    nextButtonLabel?: string;
    previousButtonLabel?: string;
};

type StepGraphNode = { step: Step; blocks: Blocks; edges: Edges };

// Graph structure
type FormGraph = StepGraphNode[]

const createDefaultStepNodeGraph = (): StepGraphNode => {
    const id = nanoid();
    return {
        step: {
            id,
            label: 'Step 1',
            nextButtonLabel: 'Next',
            previousButtonLabel: 'Previous'
        },
        blocks: createBlocks(),
        edges: [createEdge()]
    };
};

// Create an empty form flow graph
const createDefaultFormGraph = (): FormGraph => {
    const step = createDefaultStepNodeGraph();
    return [step];
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
    const id = nanoid();
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
    createDefaultFormGraph, createDefaultFormSchema, createDefaultStepNodeGraph
};