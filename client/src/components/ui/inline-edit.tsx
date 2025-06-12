import { Show, createSignal } from "solid-js";
import type { Accessor, Component, JSX } from "solid-js";
import { Input } from "./input";
import { TextField, TextFieldInput, TextFieldTextArea } from "./text-field";
import PencilIcon from "lucide-solid/icons/pencil";

type InlineEditProps<T> = {
	value: Accessor<T>;
	onSave: (value: T) => void;
	displayComponent: Component<{ value: T; class?: string }>;
	editComponent?: "input" | "textarea";
	placeholder?: string;
	class?: string;
	rows?: number;
};

export function InlineEdit<T extends string>(props: InlineEditProps<T>) {
	const [isEditing, setIsEditing] = createSignal(false);
	const [editValue, setEditValue] = createSignal<T>(props.value());

	const startEditing = () => {
		const currentValue = props.value();
		setEditValue(() => currentValue);
		setIsEditing(true);
	};

	const saveChanges = () => {
		props.onSave(editValue());
		setIsEditing(false);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && props.editComponent !== "textarea") {
			saveChanges();
		} else if (e.key === "Escape") {
			setIsEditing(false);
		}
	};

	const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
		const newValue = e.currentTarget.value as T;
		setEditValue(() => newValue);
	};

	return (
		<Show
			when={!isEditing()}
			fallback={
				<Show
					when={props.editComponent !== "textarea"}
					fallback={
						<TextField>
							<TextFieldTextArea
								value={editValue()}
								onInput={handleInput}
								onBlur={saveChanges}
								onKeyDown={handleKeyDown}
								rows={props.rows || 3}
								placeholder={props.placeholder}
								autofocus
							/>
						</TextField>
					}
				>
					<TextField>
						<TextFieldInput
							value={editValue()}
							onInput={handleInput}
							onBlur={saveChanges}
							onKeyDown={handleKeyDown}
							placeholder={props.placeholder}
							autofocus
						/>
					</TextField>
				</Show>
			}
		>
			<div
				class={`flex items-baseline space-x-3 group relative ${props.class || ""}`}
			>
				<props.displayComponent
					value={props.value()}
					class="hover:text-primary"
				/>
				<button onClick={startEditing} aria-label="Edit">
					<PencilIcon
						size={16}
						class="text-muted-foreground hover:text-primary transition-colors"
					/>
				</button>
			</div>
		</Show>
	);
}
