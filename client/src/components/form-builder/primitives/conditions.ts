
export type ComparisonOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'empty'
  | 'notEmpty';

export type LogicalOperator = 'and' | 'or';

export interface Condition {
  fieldId: string;
  operator: ComparisonOperator;
  value: any;
}

export interface ConditionGroup {
  operator: LogicalOperator;
  conditions: (Condition | ConditionGroup)[];
}