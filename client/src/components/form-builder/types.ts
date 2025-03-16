export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'section'
  | 'group';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
}

export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation?: FieldValidation;
  conditionalDisplay?: ConditionalRule[];
  options?: FieldOption[]; // For select, radio, checkbox
  fields?: FormField[]; // For group type
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormSchema {
  id: string;
  name: string;
  description: string;
  rules?: string;
  eligibility?: string;
  sections: FormSection[];
}
