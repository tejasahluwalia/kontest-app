import type { StoreSetter } from "solid-js";
import { createSignal } from "solid-js";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { SelectField as SelectFieldType } from "../../primitives/fields";
import type { InputFormData } from "../../primitives/form";
import { FieldWrapper } from "./field-wrapper";

interface SelectFieldProps {
	child: SelectFieldType;
	onSelect?: () => void;
	blockId: string;
	stepId: string;
	formData?: InputFormData;
	updateFormData?: StoreSetter<InputFormData>;
}

export function SelectField(props: SelectFieldProps) {
	const [value, setValue] = createSignal("");

	// Transform field options to the format expected by the Select component
	const options = () => {
		return (props.child.options || []).map((option) => option.value);
	};

	return (
		<FieldWrapper
			childId={props.child.id}
			blockId={props.blockId}
			stepId={props.stepId}
			label={props.child.label}
			helpText={props.child.helpText}
			required={props.child.required}
		>
			<Select
				value={value()}
				onChange={setValue}
				options={options()}
				placeholder={props.child.placeholder || "Select an option..."}
				itemComponent={(props) => (
					<SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
				)}
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
