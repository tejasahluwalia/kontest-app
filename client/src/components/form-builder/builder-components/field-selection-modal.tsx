import { Button } from "@client/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@client/components/ui/dialog";
import { For, createSignal, type Component } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import { createChild } from "../primitives/children";
import type { InputField } from "../primitives/fields";

interface FieldTypeOption {
	type:
		| "text"
		| "number"
		| "select"
		| "checkbox"
		| "radio"
		| "date"
		| "time"
		| "file"
		| "rich-text"
		| "array";
	label: string;
	icon: string;
}

const fieldTypes: FieldTypeOption[] = [
	{ type: "text", label: "Text", icon: "text" },
	{ type: "rich-text", label: "Rich text", icon: "paragraph" },
	{ type: "number", label: "Number", icon: "number" },
	{ type: "select", label: "Dropdown", icon: "dropdown" },
	{ type: "checkbox", label: "Checkboxes", icon: "checkbox" },
	{ type: "radio", label: "Radio", icon: "radio" },
	{ type: "date", label: "Date", icon: "date" },
	{ type: "time", label: "Time", icon: "date" },
	{ type: "file", label: "File Upload", icon: "file" },
	{ type: "array", label: "Array", icon: "array" },
];

interface FieldSelectionModalProps {
	blockId: string;
	stepId: string;
}

export const FieldSelectionModal: Component<FieldSelectionModalProps> = (
	props,
) => {
	const { addChildToBlock } = useFormBuilder();
	const [isOpen, setIsOpen] = createSignal(false);

	const handleAddField = (
		type:
			| "text"
			| "number"
			| "select"
			| "checkbox"
			| "radio"
			| "date"
			| "time"
			| "file"
			| "rich-text"
			| "array",
	) => {
		const newChild = createChild() as InputField;
		newChild.fieldType = type;
		addChildToBlock(newChild, props.blockId, props.stepId);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen()} onOpenChange={setIsOpen}>
			<DialogTrigger>
				<Button variant="outline" size="sm" class="w-full mt-2">
					Add Field
				</Button>
			</DialogTrigger>
			<DialogContent class="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Select Field Type</DialogTitle>
				</DialogHeader>
				<div class="grid grid-cols-2 gap-2 py-4">
					<For each={fieldTypes}>
						{(fieldType) => (
							<Button
								variant="outline"
								class="flex flex-col items-center justify-center h-20 p-2"
								onClick={() => handleAddField(fieldType.type)}
							>
								<div class="text-lg mb-1">{getFieldIcon(fieldType.icon)}</div>
								<span class="text-xs">{fieldType.label}</span>
							</Button>
						)}
					</For>
				</div>
			</DialogContent>
		</Dialog>
	);
};

function getFieldIcon(icon: string) {
	switch (icon) {
		case "text":
			return "Aa";
		case "paragraph":
			return "¶";
		case "number":
			return "123";
		case "dropdown":
			return "▼";
		case "multiselect":
			return "▼▼";
		case "checkbox":
			return "☑";
		case "radio":
			return "◉";
		case "date":
			return "📅";
		case "file":
			return "📎";
		default:
			return "?";
	}
}
