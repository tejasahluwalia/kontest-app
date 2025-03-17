// import { produce } from 'solid-js/store';
// import type { SetStoreFunction } from 'solid-js/store';
// import { createId, createNewNode, findNodeById } from '../utils/helpers';

// /**
//  * Adds a new node to the form schema
//  * @param schema The current form schema
//  * @param type The type of node to add
//  * @param parentId The parent node ID (if any)
//  * @returns Updated schema and the created node ID
//  */
// export const addNode = (
//   schema: FormSchema,
//   type: NodeType,
//   parentId?: string
// ): { newSchema: FormSchema; newNodeId: string } => {
//   const newNode = createNewNode(type);
//   const newNodeId = newNode.id;
  
//   const newSchema = produce<FormSchema>(draft => {
//     // If parentId is provided, add as a child to that parent
//     if (parentId) {
//       const parentNode = findNodeById(draft.flow.nodes, parentId);
//       if (parentNode && ('children' in parentNode)) {
//         // Parent is a container, add to its children
//         parentNode.children.push(newNode);
//       } else {
//         // Not a valid parent, add to root
//         draft.flow.nodes.push(newNode);
//       }
//     } else {
//       // No parent, add to root
//       draft.flow.nodes.push(newNode);
//     } 
    
//     // Update modified timestamp
//     draft.updatedAt = new Date().toISOString();
//   });
  
//   return { newSchema: newSchema(schema), newNodeId };
// };

// /**
//  * Updates a node in the form schema
//  * @param schema The current form schema
//  * @param nodeId The ID of the node to update
//  * @param updates The updates to apply to the node
//  * @returns Updated schema
//  */
// export const updateNode = (
//   schema: FormSchema,
//   nodeId: string,
//   updates: Partial<FormNode>
// ): FormSchema => {
//   const newSchema = produce<FormSchema>(draft => {
//     const node = findNodeById(draft.flow.nodes, nodeId);
    
//     if (node) {
//       // Apply updates to the node
//       Object.assign(node, updates);
      
//       // Update modified timestamp
//       draft.updatedAt = new Date().toISOString();
//     }
//   })
//   return newSchema(schema);
// };

// /**
//  * Removes a node from the form schema
//  * @param schema The current form schema
//  * @param nodeId The ID of the node to remove
//  * @returns Updated schema
//  */
// export const removeNode = (
//   schema: FormSchema,
//   nodeId: string
// ): FormSchema => {
//   const newSchema = produce<FormSchema>(draft => {
//     // Find the parent node containing this node
//     const removeNodeFromCollection = (nodes: FormNode[]): boolean => {
//       const index = nodes.findIndex(node => node.id === nodeId);
      
//       if (index >= 0) {
//         // Remove node from this collection
//         nodes.splice(index, 1);
//         return true;
//       }
      
//       // If not found at this level, check children
//       for (const node of nodes) {
//         if ('children' in node && node.children && removeNodeFromCollection(node.children)) {
//           return true;
//         }
//       }
      
//       return false;
//     };
    
//     // Remove the node
//     removeNodeFromCollection(draft.flow.nodes);
    
//     // Also remove any connections involving this node
//     draft.flow.connections = draft.flow.connections.filter(
//       conn => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
//     );
    
//     // Update modified timestamp
//     draft.updatedAt = new Date().toISOString();
//   });
//   return newSchema(schema);
// };

// /**
//  * Moves a node within the form schema
//  * @param schema The current form schema
//  * @param nodeId The ID of the node to move
//  * @param newParentId The ID of the new parent node
//  * @param index The index position in the new parent's children
//  * @returns Updated schema
//  */
// export const moveNode = (
//   schema: FormSchema,
//   nodeId: string,
//   newParentId: string | null,
//   index: number = -1
// ): FormSchema => {
//   const newSchema = produce<FormSchema>(draft => {
//     let nodeToMove: FormNode | undefined;
//     let currentParentNodes: FormNode[] | undefined;
    
//     // First, find and remove the node from its current location
//     const findAndRemoveNode = (nodes: FormNode[], parent?: FormNode): boolean => {
//       const nodeIndex = nodes.findIndex(node => node.id === nodeId);
      
//       if (nodeIndex >= 0) {
//         nodeToMove = nodes[nodeIndex];
//         currentParentNodes = nodes;
//         nodes.splice(nodeIndex, 1);
//         return true;
//       }
      
//       // If not found at this level, check children
//       for (const node of nodes) {
//         if ('children' in node && node.children && findAndRemoveNode(node.children, node)) {
//           return true;
//         }
//       }
      
//       return false;
//     };
    
//     findAndRemoveNode(draft.flow.nodes);
    
//     if (!nodeToMove) {
//       return; // Node not found
//     }
    
//     // Then add it to the new parent
//     if (newParentId === null) {
//       // Move to root level
//       const insertIndex = index >= 0 ? index : draft.flow.nodes.length;
//       draft.flow.nodes.splice(insertIndex, 0, nodeToMove);
//     } else {
//       // Move to specific parent
//       const newParent = findNodeById(draft.flow.nodes, newParentId);
      
//       if (newParent && 'children' in newParent) {
//         const insertIndex = index >= 0 ? index : newParent.children.length;
//         newParent.children.splice(insertIndex, 0, nodeToMove);
//       } else {
//         // If new parent not found or doesn't accept children, 
//         // put the node back where it was
//         if (currentParentNodes) {
//           currentParentNodes.push(nodeToMove);
//         } else {
//           draft.flow.nodes.push(nodeToMove);
//         }
//       }
//     }
    
//     // Update modified timestamp
//     draft.updatedAt = new Date().toISOString();
//   });
  
//   return newSchema(schema);
// };

// /**
//  * Adds a connection between nodes in the form schema
//  * @param schema The current form schema
//  * @param fromNodeId The source node ID
//  * @param toNodeId The target node ID
//  * @param condition The condition for the connection
//  * @returns Updated schema and the created connection ID
//  */
// export const addConnection = (
//   schema: FormSchema,
//   fromNodeId: string,
//   toNodeId: string,
//   condition?: Condition | ConditionGroup
// ): { newSchema: FormSchema; connectionId: string } => {
//   const connectionId = createId();

//   const newSchema = produce<FormSchema>(draft => {    
//     const newConnection: NodeConnection = {
//       sourceNodeId: fromNodeId,
//       targetNodeId: toNodeId,
//       condition
//     };
    
//     draft.flow.connections.push(newConnection);
    
//     // Update modified timestamp
//     draft.updatedAt = new Date().toISOString();
//   });

//   return { newSchema: newSchema(schema), connectionId };
// };

// /**
//  * Removes a connection from the form schema
//  * @param schema The current form schema
//  * @param connectionId The ID of the connection to remove
//  * @returns Updated schema
//  */
// export const removeConnection = (
//   schema: FormSchema,
//   connectionId: string
// ): FormSchema => {
//   const newSchema = produce<FormSchema>(draft => {
//     const index = draft.flow.connections.findIndex(conn => conn.targetNodeId === connectionId);
    
//     if (index >= 0) {
//       draft.flow.connections.splice(index, 1);
      
//       // Update modified timestamp
//       draft.updatedAt = new Date().toISOString();
//     }
//   });
//   return newSchema(schema);
// };

// /**
//  * Adds a field template to the form schema
//  * @param schema The current form schema
//  * @param template The template to add
//  * @returns Updated schema and the created template ID
//  */
// export const addTemplate = (
//   schema: FormSchema,
//   template: Omit<FieldTemplate, 'id'>
// ): { newSchema: FormSchema; templateId: string } => {
//   const templateId = createId();
  
//   const newSchema = produce<FormSchema>(draft => {
//     const newTemplate: FieldTemplate = {
//       id: templateId,
//       ...template
//     };
    
//     draft.templates.push(newTemplate);
    
//     // Update modified timestamp
//     draft.updatedAt = new Date().toISOString();
//   });
  
//   return { newSchema: newSchema(schema), templateId };
// };

// /**
//  * Updates a field template in the form schema
//  * @param schema The current form schema
//  * @param templateId The ID of the template to update
//  * @param updates The updates to apply to the template
//  * @returns Updated schema
//  */
// export const updateTemplate = (
//   schema: FormSchema,
//   templateId: string,
//   updates: Partial<FieldTemplate>
// ): FormSchema => {
//   const newSchema = produce<FormSchema>(draft => {
//     const template = draft.templates.find((t: FieldTemplate) => t.id === templateId);
    
//     if (template) {
//       // Apply updates to the template
//       Object.assign(template, updates);
      
//       // Update modified timestamp
//       draft.updatedAt = new Date().toISOString();
//     }
//   });
  
//   return newSchema(schema);
// };

// /**
//  * Removes a field template from the form schema
//  * @param schema The current form schema
//  * @param templateId The ID of the template to remove
//  * @returns Updated schema
//  */
// export const removeTemplate = (
//   schema: FormSchema,
//   templateId: string
// ): FormSchema => {
//   const newSchema = produce<FormSchema>(draft => {
//     const index = draft.templates.findIndex((t: FieldTemplate) => t.id === templateId);
    
//     if (index >= 0) {
//       draft.templates.splice(index, 1);
      
//       // Update modified timestamp
//       draft.updatedAt = new Date().toISOString();
//     }
//   });
  
//   return newSchema(schema);
// };

// /**
//  * Duplicates a node in the form schema
//  * @param schema The current form schema
//  * @param nodeId The ID of the node to duplicate
//  * @returns Updated schema and the ID of the duplicated node
//  */
// export const duplicateNode = (
//   schema: FormSchema,
//   nodeId: string
// ): { newSchema: FormSchema; newNodeId: string } => {
//   let newNodeId = '';
  
//   const newSchema = produce<FormSchema>(draft => {
//     const originalNode = findNodeById(draft.flow.nodes, nodeId);
    
//     if (!originalNode) {
//       // Node not found
//       return;
//     }
    
//     // Deep clone the node
//     const clonedNode = JSON.parse(JSON.stringify(originalNode)) as FormNode;
    
//     // Generate new IDs for the cloned node and its children
//     newNodeId = createId();
//     clonedNode.id = newNodeId;
    
//     // If the node has children, generate new IDs for them too
//     const regenerateIds = (node: FormNode) => {
//       node.id = createId();
      
//       if ('children' in node && node.children) {
//         node.children.forEach(child => regenerateIds(child));
//       }
//     };
    
//     if ('children' in clonedNode && clonedNode.children) {
//       clonedNode.children.forEach(child => regenerateIds(child));
//     }
    
//     // Find parent of the original node
//     let parentNode: FormNode | undefined;
//     let nodeIndex = -1;
    
//     const findParent = (nodes: FormNode[]): boolean => {
//       nodeIndex = nodes.findIndex(node => node.id === nodeId);
      
//       if (nodeIndex >= 0) {
//         return true;
//       }
      
//       for (const node of nodes) {
//         if ('children' in node && node.children) {
//           const foundInChildren = findParent(node.children);
//           if (foundInChildren) {
//             parentNode = node;
//             return true;
//           }
//         }
//       }
      
//       return false;
//     };
    
//     findParent(draft.flow.nodes);
    
//     // Add the cloned node in the appropriate place
//     if (parentNode && 'children' in parentNode) {
//       parentNode.children.splice(nodeIndex + 1, 0, clonedNode);
//     } else {
//       // Add to root level
//       draft.flow.nodes.splice(
//         draft.flow.nodes.findIndex(node => node.id === nodeId) + 1, 
//         0, 
//         clonedNode
//       );
//     }
    
//     // Update modified timestamp
//     draft.updatedAt = new Date().toISOString();
//   });
  
//   return { newSchema: newSchema(schema), newNodeId };
// };
