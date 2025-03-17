import { createSignal } from "solid-js";
import type { SelectField } from "../primitives/fields";
import { FieldWrapper } from "./field-wrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface SelectFieldProps {
  child: SelectField;
  onSelect?: () => void;
  blockId: string;
}

export function SelectField(props: SelectFieldProps) {
  const [value, setValue] = createSignal("");
  
  // Transform field options to the format expected by the Select component
  const options = () => {
    return (props.child.options || []).map(option => option.value);
  };

  return (
    <FieldWrapper
      childId={props.child.id}
      blockId={props.blockId}
      label={props.child.label}
      helpText={props.child.helpText}
      required={props.child.required}
    >
      <Select
        value={value()}
        onChange={setValue}
        options={options()}
        placeholder={props.child.placeholder || "Select an option..."}
        itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
        disabled={true}
      >
        <SelectTrigger aria-label={props.child.label || "Select"}>
          <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
    </FieldWrapper>
  );
}
