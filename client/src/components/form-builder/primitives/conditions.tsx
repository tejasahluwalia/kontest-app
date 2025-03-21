
import { type Accessor, type Component, ErrorBoundary, For, type Setter, Show, createEffect, createMemo, createSignal, createUniqueId } from 'solid-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@client/components/ui/select';
import { Input } from '@client/components/ui/input';
import { Button } from '@client/components/ui/button';
import PlusCircle from 'lucide-solid/icons/plus-circle';
import Trash from 'lucide-solid/icons/trash';
import { nanoid } from 'nanoid';

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
  | 'notEmpty'
  | 'like'
  | 'regex'
  | 'notLike'
  | 'notRegex';

export type LogicalOperator = 'and' | 'or';

export type ValueType = 'formValue' | 'constant';

export interface Condition {
  id: string;
  leftType: ValueType;
  leftValue: string;
  operator: ComparisonOperator;
  rightType: ValueType;
  rightValue: string;
}

export interface ConditionGroup {
  id: string;
  operator: LogicalOperator;
  conditions: (Condition | ConditionGroup)[];
}

export interface Action {
  id: string;
  name: string;
  value: string;
}

export interface ConditionalRule {
  id: string;
  condition: ConditionGroup;
  action: Action;
}

interface FormValue {
  id: string;
  label: string;
  value: string;
}

// Function to evaluate a conditional rule against form data
export function evaluateConditionalRule(rule: ConditionalRule, formData: Record<string, any>): boolean {
  return evaluateConditionGroup(rule.condition, formData);
}

// Function to evaluate a condition group (handles nested conditions with AND/OR logic)
function evaluateConditionGroup(group: ConditionGroup, formData: Record<string, any>): boolean {
  if (group.conditions.length === 0) return true;
  
  const results = group.conditions.map(condition => {
    if ('operator' in condition && (condition.operator === 'and' || condition.operator === 'or')) {
      // This is a nested group
      return evaluateConditionGroup(condition as ConditionGroup, formData);
    } else {
      // This is a single condition
      return evaluateSingleCondition(condition as Condition, formData);
    }
  });
  
  // Apply the logical operator (AND/OR)
  if (group.operator === 'and') {
    return results.every(result => result);
  } else {
    return results.some(result => result);
  }
}

// Function to evaluate a single condition
function evaluateSingleCondition(condition: Condition, formData: Record<string, any>): boolean {
  // Get the left and right values
  const leftValue = getConditionValue(condition.leftType, condition.leftValue, formData);
  const rightValue = getConditionValue(condition.rightType, condition.rightValue, formData);
  
  // Apply the comparison operator
  switch (condition.operator) {
    case 'equals':
      return leftValue === rightValue;
    case 'notEquals':
      return leftValue !== rightValue;
    case 'contains':
      return String(leftValue).includes(String(rightValue));
    case 'notContains':
      return !String(leftValue).includes(String(rightValue));
    case 'greaterThan':
      return Number(leftValue) > Number(rightValue);
    case 'lessThan':
      return Number(leftValue) < Number(rightValue);
    case 'greaterThanOrEqual':
      return Number(leftValue) >= Number(rightValue);
    case 'lessThanOrEqual':
      return Number(leftValue) <= Number(rightValue);
    case 'empty':
      return leftValue === '' || leftValue === null || leftValue === undefined;
    case 'notEmpty':
      return leftValue !== '' && leftValue !== null && leftValue !== undefined;
    case 'like':
      return new RegExp(String(rightValue), 'i').test(String(leftValue));
    case 'notLike':
      return !new RegExp(String(rightValue), 'i').test(String(leftValue));
    case 'regex':
      try {
        return new RegExp(String(rightValue)).test(String(leftValue));
      } catch {
        return false;
      }
    case 'notRegex':
      try {
        return !new RegExp(String(rightValue)).test(String(leftValue));
      } catch {
        return true;
      }
    default:
      return false;
  }
}

// Helper function to get the actual value based on the value type
function getConditionValue(type: ValueType, value: string, formData: Record<string, any>): any {
  if (type === 'formValue') {
    return formData[value];
  } else {
    return value;
  }
}

const COMPARISON_OPERATORS: { label: string; value: ComparisonOperator }[] = [
  { label: 'Equals', value: 'equals' },
  { label: 'Not Equals', value: 'notEquals' },
  { label: 'Contains', value: 'contains' },
  { label: 'Not Contains', value: 'notContains' },
  { label: 'Greater Than', value: 'greaterThan' },
  { label: 'Less Than', value: 'lessThan' },
  { label: 'Greater Than or Equal', value: 'greaterThanOrEqual' },
  { label: 'Less Than or Equal', value: 'lessThanOrEqual' },
  { label: 'Empty', value: 'empty' },
  { label: 'Not Empty', value: 'notEmpty' },
  { label: 'Like', value: 'like' },
  { label: 'Regex', value: 'regex' },
  { label: 'Not Like', value: 'notLike' },
  { label: 'Not Regex', value: 'notRegex' },
];

const LOGICAL_OPERATORS: { label: string; value: LogicalOperator }[] = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' },
];

const VALUE_TYPES: { label: string; value: ValueType }[] = [
  { label: 'Form Value', value: 'formValue' },
  { label: 'Constant', value: 'constant' },
];

const SingleCondition: Component<{
  condition: Accessor<Condition>;
  formValues: FormValue[];
  onUpdate: (condition: Condition) => void;
  onRemove: () => void;
  isRemovable: boolean;
}> = (props) => {
  const [leftConstant, setLeftConstant] = createSignal(props.condition().leftValue);
  const [rightConstant, setRightConstant] = createSignal(props.condition().rightValue);
  return (
    <div class="flex items-center gap-2 mb-2">
      <div class="flex-1 flex items-center gap-2">
        <div class="grid">
        <Select
          options={VALUE_TYPES}
          value={VALUE_TYPES.find(vt => vt.value === props.condition().leftType)}
          optionTextValue="label"
          optionValue="value"
          onChange={(value) => { if (value)  props.onUpdate({ ...props.condition(), leftType: value.value })}}
          placeholder="Select type"
          itemComponent={(props) => <SelectItem class="uppercase" item={props.item}>{props.item.rawValue.label}</SelectItem>}
          class="w-32"
        >
          <SelectTrigger class='uppercase' aria-label="Select type">
            <SelectValue<{ label: string; value: ValueType; }>>{(state) => state.selectedOption()?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
        <Show
          when={props.condition().leftType === 'formValue'}
          fallback={
            <Input
              value={leftConstant()}
              onInput={(e) => setLeftConstant(e.currentTarget.value)}
              placeholder="Enter value"
              onBlur={() => props.onUpdate({ ...props.condition(), leftValue: leftConstant() })}
              class="w-40"
            />
          }
        >
          <Select
            options={props.formValues}
            value={props.formValues.find(fv => fv.value === props.condition().leftValue)}
            optionTextValue="label"
            optionValue="value"
            onChange={(value) => { if (value) props.onUpdate({ ...props.condition(), leftValue: value?.value }) }}
            placeholder="Select form value"
            itemComponent={(props) => <SelectItem class="uppercase" item={props.item}>{props.item.rawValue.label}</SelectItem>}
            class="w-40"
          >
            <SelectTrigger class='uppercase' aria-label="Select form value">
              <SelectValue<FormValue>>{(state) => state.selectedOption()?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </Show>
        </div>

        <Select
          options={COMPARISON_OPERATORS}
          value={COMPARISON_OPERATORS.find(co => co.value === props.condition().operator)}
          optionTextValue="label"
          optionValue="value"
          onChange={(value) => { if (value) props.onUpdate({ ...props.condition(), operator: value.value }) }}
          placeholder="Select operator"
          class="w-40"
          itemComponent={(props) => <SelectItem class="uppercase" item={props.item}>{props.item.rawValue.label}</SelectItem>}
        >
          <SelectTrigger class='uppercase' aria-label="Select operator">
            <SelectValue<{label:string, value: ComparisonOperator}>>{(state) => state.selectedOption()?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>

        <Select
          options={VALUE_TYPES}
          value={VALUE_TYPES.find(vt => vt.value === props.condition().rightType)}
          optionTextValue="label"
          optionValue="value"
          onChange={(value) => { if (value) props.onUpdate({ ...props.condition(), rightType: value.value }) }}
          placeholder="Select type"
          class="w-32"
          itemComponent={(props) => <SelectItem class="uppercase" item={props.item}>{props.item.rawValue.label}</SelectItem>}
        >
          <SelectTrigger class='uppercase' aria-label="Select type">
            <SelectValue<{label:string, value: ValueType}>>{(state) => state.selectedOption()?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
        <Show
          when={props.condition().rightType === 'formValue'}
          fallback={
            <Input
              value={rightConstant()}
              onInput={(e) => setRightConstant(e.currentTarget.value)}
              placeholder="Enter value"
              onBlur={() => props.onUpdate({ ...props.condition(), rightValue: rightConstant() })}
              class="w-40"
            />
          }
        >
          <Select
            options={props.formValues}
            value={props.formValues.find(fv => fv.value === props.condition().rightValue)}
            optionTextValue="label"
            optionValue="value"
            onChange={(value) => { if (value) props.onUpdate({ ...props.condition(), rightValue: value.value }) }}
            placeholder="Select form value"
            itemComponent={(props) => <SelectItem class="uppercase" item={props.item}>{props.item.rawValue.label}</SelectItem>}
            class="w-40"
          >
            <SelectTrigger class='uppercase' aria-label="Select form value">
              <SelectValue<FormValue>>{(state) => state.selectedOption()?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>
        </Show>
      </div>
      <Show when={props.isRemovable}>
        <Button
          variant="ghost"
          size="icon"
          onClick={props.onRemove}
          class="text-destructive"
        >
          <Trash class="h-4 w-4" />
        </Button>
      </Show>
    </div>
  );
};

const ConditionGroupComponent: Component<{
  group: Accessor<ConditionGroup>;
  formValues: FormValue[];
  onUpdate: (group: ConditionGroup) => void;
  onRemove: () => void;
  isRemovable: boolean;
  level?: number;
}> = (props) => {
  const level = props.level || 0;
  
  const addCondition = () => {
    const newCondition: Condition = {
      id: createUniqueId(),
      leftType: 'formValue',
      leftValue: '',
      operator: 'equals',
      rightType: 'constant',
      rightValue: ''
    };
    
    props.onUpdate({
      ...props.group(),
      conditions: [...props.group().conditions, newCondition]
    });
  };

  const addGroup = () => {
    const newGroup: ConditionGroup = {
      id: createUniqueId(),
      operator: 'and',
      conditions: []
    };
    
    props.onUpdate({
      ...props.group(),
      conditions: [...props.group().conditions, newGroup]
    });
  };

  const updateCondition = (index: number, condition: Condition | ConditionGroup) => {
    const newConditions = [...props.group().conditions];
    newConditions[index] = condition;
    props.onUpdate({ ...props.group(), conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = [...props.group().conditions];
    newConditions.splice(index, 1);
    props.onUpdate({ ...props.group(), conditions: newConditions });
  };

  return (
    <div class={`p-4 border rounded-md mb-2 ${level > 0 ? 'ml-4' : ''}`}>
      <div class="flex items-center gap-2 mb-4">
        <Show when={level > 0}>
          <span class="font-medium">IF</span>
        </Show>
        <Select
          options={LOGICAL_OPERATORS.map(op => op.value)}
          value={props.group().operator}
          onChange={(value) => props.onUpdate({ ...props.group(), operator: value as LogicalOperator })}
          placeholder="Select operator"
          itemComponent={(props) => <SelectItem class="uppercase" item={props.item}>{props.item.rawValue}</SelectItem>}
        >
          <SelectTrigger class='uppercase' aria-label="Select operator">
            <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
        <Show when={props.isRemovable}>
          <Button
            variant="ghost"
            size="icon"
            onClick={props.onRemove}
            class="text-destructive ml-auto"
          >
            <Trash class="h-4 w-4" />
          </Button>
        </Show>
      </div>
<ErrorBoundary fallback={null}>

      <For each={props.group().conditions}>
        {(condition, index) => (
          <Show
            when={LOGICAL_OPERATORS.some(op => op.value === condition.operator)}
            fallback={
              <SingleCondition
                condition={() =>condition as Condition}
                formValues={props.formValues}
                onUpdate={(updatedCondition) => updateCondition(index(), updatedCondition)}
                onRemove={() => removeCondition(index())}
                isRemovable={props.group().conditions.length > 1}
              />
            }
          >
            <ConditionGroupComponent
              group={() => condition as ConditionGroup}
              formValues={props.formValues}
              onUpdate={(updatedGroup) => updateCondition(index(), updatedGroup)}
              onRemove={() => removeCondition(index())}
              isRemovable={true}
              level={level + 1}
            />
          </Show>
        )}
      </For>
</ErrorBoundary>


      <div class="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={addCondition}
          class="flex items-center gap-1"
        >
          <PlusCircle class="h-4 w-4" />
          Add Condition
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addGroup}
          class="flex items-center gap-1"
        >
          <PlusCircle class="h-4 w-4" />
          Add Group
        </Button>
      </div>
    </div>
  );
};


interface ConditionalLogicProps {
  formValues: FormValue[];
  actions: Action[];
  onChange: Setter<ConditionalRule[]>;
  rules: Accessor<ConditionalRule[]>;
}

export const ConditionalLogic: Component<ConditionalLogicProps> = ({rules, onChange, actions, formValues}) => {
  const addRule = () => {
    const newRule: ConditionalRule = {
      id: nanoid(),
      condition: {
        id: nanoid(),
        operator: 'and',
        conditions: [
          {
            id: nanoid(),
            leftType: 'formValue',
            leftValue: '',
            operator: 'equals',
            rightType: 'constant',
            rightValue: ''
          }
        ]
      },
      action: { id: '', name: '', value: '' }
    };
    
    const updatedRules = [...rules()];
    updatedRules.push(newRule);
    onChange(updatedRules);
  };

  const updateRule = (index: number, rule: ConditionalRule) => {
    const updatedRules = [...rules()];
    updatedRules[index] = rule;
    onChange(updatedRules);
  };

  const removeRule = (index: number) => {
    const updatedRules = [...rules()];
    updatedRules.splice(index, 1);
    onChange(updatedRules);
  };

  return (
    <div class="space-y-4">
      <For each={rules()}>
        {(rule, index) => {
          return (
          <div class="border rounded-md p-4">
            <div class="mb-4">
              <span class="font-medium">IF</span>
            </div>
            
            <ConditionGroupComponent
              group={() => rule.condition}
              formValues={formValues}
              onUpdate={(updatedGroup) => updateRule(index(), { ...rule, condition: updatedGroup })}
              onRemove={() => removeRule(index())}
              isRemovable={false}
              level={0}
            />
            
            <div class="mt-4 flex items-center gap-2">
              <span class="font-medium">THEN</span>
              <Select
                options={actions}
                optionTextValue="name"
                optionValue="id"
                value={rule.action}
                onChange={(value) => {
                  if (value) {
                    updateRule(index(), {
                      ...rule,
                      action: value
                    });
                  }
                }}
                itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.name}</SelectItem>}
              >
                <SelectTrigger aria-label="Select destination step" class="w-60">
                    <SelectValue<Action>>{(state) => state.selectedOption().name}</SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRule(index())}
                class="text-destructive ml-auto"
              >
                <Trash class="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}}
      </For>
      
      <Button
        variant="outline"
        onClick={addRule}
        class="flex items-center gap-1"
      >
        <PlusCircle class="h-4 w-4" />
        Add Rule
      </Button>
    </div>
  );
};