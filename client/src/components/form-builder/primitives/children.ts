import { createId } from "@paralleldrive/cuid2";
import type { Display, InputField } from "./fields";

type Child = InputField | Display

// List type definition
type Children = Child[]

const createChild = (): Child => ({
    childType: 'field',
    id: createId(),
    fieldType: 'text',
    label: 'New Field',
    name: 'new_field',
    required: false,
    placeholder: 'Enter value',
    description: '',
    defaultValue: '',
})

// Create an empty list
const createChildren = (): Children => [createChild()];

// Insert at the end
const appendChild = (list: Children, value: Child): Children => {
    if (!list.length) return [value];
    return [...list, value];
};

// Insert at the beginning
const prependChild = (list: Children, value: Child): Children => {
    if (!list.length) return [value];
    return [value, ...list];
};

// Find a node by ID
const findChildById = (list: Children, id: string): Child | undefined => {
    return list.find(child => child.id === id);
};

// Insert after a specific child
const appendChildAfter = (list: Children, targetId: string, newValue: Child): Children => {
    const targetNode = findChildById(list, targetId);
    
    // If target node not found, append to the end
    if (!targetNode) return appendChild(list, newValue);
    
    list.splice(list.indexOf(targetNode) + 1, 0, newValue);    
    return [...list];
};

// Move a child one position earlier (before its previous node)
const moveChildUp = (list: Children, childId: string): Children => {
    const childNode = list.indexOf(findChildById(list, childId)!);
    
    // If node not found or it's already at the top (no previous node), return unchanged
    if (childNode === -1 || childNode === 0) return list;
    
    // Get the previous node
    const prevNode = list[childNode - 1];
    
    // Swap the nodes
    list[childNode] = prevNode;
    list[childNode - 1] = findChildById(list, childId)!;
    return [...list];
};

// Move a child one position later (after its next node)
const moveChildDown = (list: Children, childId: string): Children => {
    const childNode = list.indexOf(findChildById(list, childId)!);
    
    // If node not found or it's already at the bottom (no next node), return unchanged
    if (childNode === -1 || childNode === list.length - 1) return list;
    
    // Get the next node
    const nextNode = list[childNode + 1];
    
    // Swap the nodes
    list[childNode] = nextNode;
    list[childNode + 1] = findChildById(list, childId)!;
    return [...list];
};

// Remove a node by ID
const removeChild = (list: Children, childId: string): Children => {
    return list.filter(child => child.id !== childId);
};

// Duplicate a node by ID
const duplicateChild = (list: Children, childId: string): Children => {
    const childNode = findChildById(list, childId);
    if (!childNode) return list;
    return appendChild(list, { ...childNode, id: createId() });
};

export {
    type Child,
    type Children,
    createChild,
    createChildren,
    appendChild,
    prependChild,
    removeChild,
    findChildById,
    appendChildAfter,
    moveChildUp,
    moveChildDown,
    duplicateChild,
};

