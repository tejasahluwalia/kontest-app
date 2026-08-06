import PencilIcon from "lucide-solid/icons/pencil";
import type { Accessor, Component, Setter } from "solid-js";
import { createSignal, Show } from "solid-js";
import { TextField, TextFieldInput } from "./text-field";

type InlineEditProps = {
	value: Accessor<string>;
	setValue: Setter<string>;
	onSave: VoidFunction;
};

export const InlineEdit: Component<InlineEditProps> = (props) => {
	const [isEditing, setIsEditing] = createSignal(false);
	const { value, setValue, onSave } = props;

	const startEditing = () => {
		setIsEditing(true);
		textFieldInput.focus();
	};

	const saveChanges = () => {
		onSave();
		setIsEditing(false);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			saveChanges();
		} else if (e.key === "Escape") {
			setIsEditing(false);
		}
	};

	let textFieldInput!: HTMLInputElement;

	return (
		<Show
			when={!isEditing()}
			fallback={
				<TextField>
					<TextFieldInput
						class="px-2 py-1 h-auto"
						ref={textFieldInput}
						value={value()}
						onInput={(e) => setValue(e.currentTarget.value)}
						// on:blur={saveChanges}
						onKeyDown={handleKeyDown}
						autofocus
					/>
				</TextField>
			}
		>
			<div class={"flex space-x-3 group"}>
				<span>{value()}</span>
				<button type="button" onClick={startEditing} aria-label="Edit">
					<PencilIcon
						size={16}
						class="text-muted-foreground hover:text-primary transition-colors"
					/>
				</button>
			</div>
		</Show>
	);
};
