import { createSignal } from "solid-js";
import type { FormField } from "../types";
import { FieldWrapper } from "./field-wrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface SelectFieldProps {
  field: FormField;
  onSelect?: () => void;
  sectionId: string;
  isDragging?: boolean;
}

export function SelectField(props: SelectFieldProps) {
  const [value, setValue] = createSignal("");
  
  // Transform field options to the format expected by the Select component
  const options = () => {
    return (props.field.options || []).map(option => option.value);
  };

  return (
    <FieldWrapper
      fieldId={props.field.id}
      sectionId={props.sectionId}
      label={props.field.label}
      helpText={props.field.helpText}
      required={props.field.required}
      isDragging={props.isDragging}
    >
      <Select
        value={value()}
        onChange={setValue}
        options={options()}
        placeholder={props.field.placeholder || "Select an option..."}
        itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
        disabled={true}
      >
        <SelectTrigger aria-label={props.field.label || "Select"}>
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </FieldWrapper>
  );
}
