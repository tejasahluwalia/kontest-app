import type { Block, BlockTemplate } from "./blocks";
import type { Condition, ConditionGroup } from "./conditions";

export type FieldType =
	| "text"
	| "number"
	| "select"
	| "multiselect"
	| "checkbox"
	| "radio"
	| "date"
	| "time"
	| "file"
	| "rich-text"
	| "group"
	| "array";

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
	minLength?: number;
	maxLength?: number;
	customMessage?: string;
}

export interface Display {
	id: string;
	childType: "display";
	content: unknown;
}

// Interface for fields (basic form fields)
export interface BaseField {
	id: string;
	childType: "field";
	fieldType: FieldType;
	name: string;
	label: string;
	description?: string;
	conditionalDisplay?: Condition | ConditionGroup;
	required?: boolean;
	validation?: FieldValidation;
	helpText?: string;
	placeholder?: string;
}

export interface TextField extends BaseField {
	fieldType: "text";
	minLength?: number;
	maxLength?: number;
	defaultValue?: string;
	value?: string;
}

export interface RichTextField extends BaseField {
	fieldType: "rich-text";
	minLength?: number;
	maxLength?: number;
	toolbarOptions?: string[];
	rows?: number;
	defaultValue?: unknown;
	value?: unknown;
}

export interface NumberField extends BaseField {
	fieldType: "number";
	min?: number | null;
	max?: number | null;
	step?: number;
	defaultValue?: number;
	value?: number;
}

export interface SelectField extends BaseField {
	fieldType: "select";
	options: FieldOption[];
	allowOther?: boolean;
	defaultValue?: string;
	value?: string;
}

export interface DateField extends BaseField {
	fieldType: "date";
	minDate?: Date;
	maxDate?: Date;
	dateFormat?: string;
	defaultValue?: Date;
	value?: Date;
}

export interface TimeField extends BaseField {
	fieldType: "time";
	timeFormat?: string;
	minDate?: string | null;
	maxDate?: string | null;
	dateFormat?: string;
	defaultValue?: string;
	value?: string;
}

export interface FileField extends BaseField {
	fieldType: "file";
	maxSize?: number;
	allowedTypes?: string[];
	multiple?: boolean;
	defaultValue?: string[];
	value?: string[];
}

export interface CheckboxField extends BaseField {
	fieldType: "checkbox";
	options: FieldOption[];
	defaultValue?: string[];
	value?: string[];
}

export interface RadioField extends BaseField {
	fieldType: "radio";
	options: FieldOption[];
	defaultValue?: string;
	value?: string;
}

export interface ArrayField extends BaseField {
	fieldType: "array";
	block: Block | BlockTemplate;
	minItems?: number;
	maxItems?: number;
	addLabel?: string;
	itemLabel?: string;
	defaultValue?: unknown[];
	value?: unknown[];
}

export type InputField =
	| TextField
	| RichTextField
	| NumberField
	| SelectField
	| DateField
	| TimeField
	| FileField
	| CheckboxField
	| RadioField
	| ArrayField;
