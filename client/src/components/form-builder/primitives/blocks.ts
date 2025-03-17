import { createId } from "@paralleldrive/cuid2";
import { createChildren, type Children } from "./children";
import type { Condition, ConditionGroup } from "./conditions";

interface BaseBlock {
    id: string;
    children: Children
    conditionalDisplay?: Condition | ConditionGroup;
}

interface BlockTemplate extends BaseBlock {
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    version: number;
}

type Block = BaseBlock | BlockTemplate

// List type definition
type Blocks = Block[]

// Create an empty list
const createBlocks = (): Blocks => ([
    {
        id: createId(), 
        children: createChildren()
    }
]);

// Insert at the end
const appendBlock = (list: Blocks, value: Block): Blocks => {
    if (!list.length) return [value];
    return [...list, value];
};

// Insert at the beginning
const prependBlock = (list: Blocks, value: Block): Blocks => {
    if (!list.length) return [value];
    return [value, ...list];
};

// Remove a node by value
const removeBlockById = (list: Blocks, id: string): Blocks => {
    return list.filter(block => block.id !== id);
};

// Find a node by ID
const findBlockById = (list: Blocks, id: string): Block | undefined => {
    return list.find(block => block.id === id);
};

// Move a block before another block
const moveBlockBefore = (list: Blocks, blockId: string, targetId: string): Blocks => {
    // Find the nodes for the block to move and the target block
    const blockNode = list.indexOf(findBlockById(list, blockId)!);
    const targetNode = list.indexOf(findBlockById(list, targetId)!);
    
    // If either node is not found, return the unchanged list
    if (blockNode === -1 || targetNode === -1) return list;
    
    // If they are the same node, no change needed
    if (blockNode === targetNode) return list;
    
    // If they are already correctly positioned (block is right before target)
    if (blockNode === targetNode - 1) return list;
    
    // Remove the block from its current position
    const [removed] = list.splice(blockNode, 1);
    
    // Insert the block before the target
    list.splice(targetNode, 0, removed);
    
    return [...list];
};

// Move a block after another block
const moveBlockAfter = (list: Blocks, blockId: string, targetId: string): Blocks => {
    // Find the nodes for the block to move and the target block
    const blockNode = list.indexOf(findBlockById(list, blockId)!);
    const targetNode = list.indexOf(findBlockById(list, targetId)!);

    // If either node is not found, return the unchanged list
    if (blockNode === -1 || targetNode === -1) return list;

    // If they are the same node, no change needed
    if (blockNode === targetNode) return list;

    // If they are already correctly positioned (block is right after target)
    if (blockNode === targetNode + 1) return list;

    // Remove the block from its current position
    const [removed] = list.splice(blockNode, 1);

    // Insert the block after the target
    list.splice(targetNode + 1, 0, removed);
    return [...list];
};

// Append a new block before another block
const appendBlockBefore = (list: Blocks, value: Block, targetId: string): Blocks => {
    const targetNode = findBlockById(list, targetId);
    
    // If target node not found, append to the end
    if (!targetNode) return appendBlock(list, value);
    
    list.splice(list.indexOf(targetNode), 0, value);
    return [...list];
};

// Append a new block after another block
const appendBlockAfter = (list: Blocks, value: Block, targetId: string): Blocks => {
    const targetNode = findBlockById(list, targetId);
    
    // If target node not found, append to the end
    if (!targetNode) return appendBlock(list, value);
    
    list.splice(list.indexOf(targetNode) + 1, 0, value);    
    return [...list];
};

// Move a block one position up in the list
const moveBlockUp = (list: Blocks, blockId: string): Blocks => {
    const blockNode = list.indexOf(findBlockById(list, blockId)!);
    
    // If node not found or it's already at the top (no previous node), return unchanged
    if (blockNode === -1 || blockNode === 0) return list;
    
    // Get the previous node
    const prevNode = list[blockNode - 1];
    
    // Swap the nodes
    list[blockNode] = prevNode;
    list[blockNode - 1] = findBlockById(list, blockId)!;
    return [...list];
};

// Move a block one position down in the list
const moveBlockDown = (list: Blocks, blockId: string): Blocks => {
    const blockNode = list.indexOf(findBlockById(list, blockId)!);
    
    // If node not found or it's already at the bottom (no next node), return unchanged
    if (blockNode === -1 || blockNode === list.length - 1) return list;
    
    // Get the next node
    const nextNode = list[blockNode + 1];
    
    // Swap the nodes
    list[blockNode] = nextNode;
    list[blockNode + 1] = findBlockById(list, blockId)!;
    return [...list];
};

export {
    type Block,
    type Blocks,
    type BlockTemplate,
    createBlocks,
    appendBlock,
    prependBlock,
    removeBlockById,
    findBlockById,
    appendBlockBefore,
    appendBlockAfter,
    moveBlockBefore,
    moveBlockAfter,
    moveBlockUp,
    moveBlockDown
};
