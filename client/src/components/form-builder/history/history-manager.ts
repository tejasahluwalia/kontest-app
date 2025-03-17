import type { FormBuilderHistory, FormSchema } from '../primitives/form';

/**
 * Creates a new history entry
 * @param schema The current form schema
 * @returns A new history entry object
 */
export const createHistoryEntry = (schema: FormSchema): FormSchema => {
  return JSON.parse(JSON.stringify(schema)); // Deep clone the schema
};

/**
 * Creates an initial history state
 * @param initialSchema The initial form schema
 * @returns An initialized history state
 */
export const createInitialHistory = (initialSchema: FormSchema): FormBuilderHistory => {
  const initialEntry = createHistoryEntry(initialSchema);
  
  return {
    past: [initialEntry],
    future: [],
  };
};

/**
 * Adds a new history entry
 * @param history The current history state
 * @param schema The current form schema
 * @returns Updated history state with the new entry
 */
export const addHistoryEntry = (
  history: FormBuilderHistory, 
  schema: FormSchema
): FormBuilderHistory => {
  const newEntry = createHistoryEntry(schema);
  
  return {
    past: [...history.past, newEntry],
    future: [],
  };
};
