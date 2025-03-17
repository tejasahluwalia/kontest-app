// Preview state for the form builder
export interface PreviewState {
  active: boolean;
  formData: Record<string, any>;
  currentStepId?: string;
  validationErrors: Record<string, string>;
  submitting: boolean;
}

// Interface for form builder UI state
export interface FormBuilderUIState {
  selectedNodeId: string | null;
  expandedNodes: string[];
  activeTab: 'builder' | 'settings' | 'preview';
  isSaving: boolean;
  lastSaved: string | null;
  preview: PreviewState;
  showTemplateLibrary: boolean;
  isTemplateDrawerOpen: boolean;
  viewMode: 'edit' | 'preview' | 'code';
  zoomLevel: number;
  panOffset: { x: number; y: number };
  snapToGrid: boolean;
  gridSize: number;
  showConnections: boolean;
}

/**
 * Creates an initial UI state object
 * @returns Default UI state for the form builder
 */
export const createInitialUIState = (): FormBuilderUIState => {
  return {
    selectedNodeId: null,
    isTemplateDrawerOpen: false,
    viewMode: 'edit',
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 },
    snapToGrid: true,
    gridSize: 10,
    showConnections: true,
    expandedNodes: [],
    showTemplateLibrary: false,
    isSaving: false,
    lastSaved: null,
    preview: {
      active: false,
      formData: {},
      validationErrors: {},
      submitting: false,
    },
    activeTab: 'builder',
  };
};

/**
 * Updates the selected node ID in the UI state
 * @param state The current UI state
 * @param nodeId The ID of the node to select, or null to deselect
 * @returns Updated UI state
 */
export const updateSelectedNode = (
  state: FormBuilderUIState, 
  nodeId: string | null
): FormBuilderUIState => {
  return {
    ...state,
    selectedNodeId: nodeId,
  };
};

/**
 * Toggles the template drawer open/closed state
 * @param state The current UI state
 * @param isOpen Whether the drawer should be open or closed
 * @returns Updated UI state
 */
export const toggleTemplateDrawer = (
  state: FormBuilderUIState, 
  isOpen?: boolean
): FormBuilderUIState => {
  return {
    ...state,
    isTemplateDrawerOpen: isOpen !== undefined ? isOpen : !state.isTemplateDrawerOpen,
  };
};

/**
 * Updates the view mode in the UI state
 * @param state The current UI state
 * @param viewMode The new view mode
 * @returns Updated UI state
 */
export const updateViewMode = (
  state: FormBuilderUIState, 
  viewMode: 'edit' | 'preview' | 'code'
): FormBuilderUIState => {
  return {
    ...state,
    viewMode,
  };
};

/**
 * Updates the zoom level in the UI state
 * @param state The current UI state
 * @param zoomLevel The new zoom level
 * @returns Updated UI state
 */
export const updateZoomLevel = (
  state: FormBuilderUIState, 
  zoomLevel: number
): FormBuilderUIState => {
  return {
    ...state,
    zoomLevel: Math.max(0.1, Math.min(2, zoomLevel)),
  };
};

/**
 * Updates the pan offset in the UI state
 * @param state The current UI state
 * @param panOffset The new pan offset
 * @returns Updated UI state
 */
export const updatePanOffset = (
  state: FormBuilderUIState, 
  panOffset: { x: number; y: number }
): FormBuilderUIState => {
  return {
    ...state,
    panOffset,
  };
};

/**
 * Toggles the snap to grid setting
 * @param state The current UI state
 * @param snapToGrid Whether to snap to grid
 * @returns Updated UI state
 */
export const toggleSnapToGrid = (
  state: FormBuilderUIState, 
  snapToGrid?: boolean
): FormBuilderUIState => {
  return {
    ...state,
    snapToGrid: snapToGrid !== undefined ? snapToGrid : !state.snapToGrid,
  };
};

/**
 * Updates the grid size in the UI state
 * @param state The current UI state
 * @param gridSize The new grid size
 * @returns Updated UI state
 */
export const updateGridSize = (
  state: FormBuilderUIState, 
  gridSize: number
): FormBuilderUIState => {
  return {
    ...state,
    gridSize: Math.max(5, Math.min(50, gridSize)),
  };
};

/**
 * Toggles the show connections setting
 * @param state The current UI state
 * @param showConnections Whether to show connections
 * @returns Updated UI state
 */
export const toggleShowConnections = (
  state: FormBuilderUIState, 
  showConnections?: boolean
): FormBuilderUIState => {
  return {
    ...state,
    showConnections: showConnections !== undefined ? showConnections : !state.showConnections,
  };
};
