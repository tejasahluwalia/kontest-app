import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Accessor, Component } from "solid-js";
import { createSignal, storePath } from "solid-js";
import {
	IconChevronDown,
	IconDotsVertical,
	IconTrash,
} from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemLabel,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { InlineEdit } from "~/components/ui/inline-edit";
import {
	Switch,
	SwitchControl,
	SwitchLabel,
	SwitchThumb,
} from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import { useFormBuilder } from "../form-builder-context";
import type { InputField } from "../primitives/fields";

interface BuilderFieldRendererProps {
	field: Accessor<InputField>;
	blockId: string;
	stepId: string;
}

export const BuilderFieldRenderer: Component<BuilderFieldRendererProps> = ({
	field,
	blockId,
}) => {
	const { selectedStepId, setFormSchema, saveForm, removeChildFromBlock } =
		useFormBuilder();
	const [label, setLabel] = createSignal(field().label);
	const [isRequired, setIsRequired] = createSignal(field().required || false);
	const [isOpen, setIsOpen] = createSignal(false);

	function handleUpdateLabel() {
		setFormSchema(
			storePath(
				"graph",
				(node) => node.step.id === selectedStepId(),
				"blocks",
				(block) => block.id === blockId,
				"children",
				(child) => child.id === field().id,
				{ label: label() },
			),
		);
		saveForm();
	}

	function handleOnDelete() {
		removeChildFromBlock(field().id, blockId, selectedStepId());
	}

	function handleChangeIsRequired(isChecked: boolean) {
		setIsRequired(isChecked);
		setFormSchema(
			storePath(
				"graph",
				(node) => node.step.id === selectedStepId(),
				"blocks",
				(block) => block.id === blockId,
				"children",
				(child) => child.id === field().id,
				{ required: isChecked },
			),
		);
		saveForm();
	}

	return (
		<Collapsible
			class="border p-2 rounded"
			open={isOpen()}
			onOpenChange={setIsOpen}
		>
			<div class="grid gap-4">
				<div class="flex justify-between">
					<div class="flex items-center gap-2">
						<Badge variant="secondary" class="uppercase">
							{field().fieldType}
						</Badge>
						<span class="font-medium">
							<InlineEdit
								value={label}
								setValue={setLabel}
								onSave={handleUpdateLabel}
							/>
						</span>
					</div>
					<div class="flex items-center space-x-2">
						<DropdownMenu>
							<DropdownMenuTrigger
								as={(
									props: PolymorphicProps<"button", ButtonProps<"button">>,
								) => <Button size="icon" variant="ghost" {...props} />}
							>
								<IconDotsVertical />
							</DropdownMenuTrigger>
							<DropdownMenuContent class="w-48">
								<DropdownMenuItem
									onClick={handleOnDelete}
									class="text-destructive focus:text-destructive flex justify-between"
								>
									<DropdownMenuItemLabel>
										<span>Delete</span>
									</DropdownMenuItemLabel>
									<IconTrash />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<CollapsibleTrigger
							as={(
								props: PolymorphicProps<"button", ButtonProps<"button">>,
							) => <Button size="icon" variant="ghost" {...props} />}
						>
							<IconChevronDown
								class={cn("transition-transform duration-300", {
									"rotate-180": isOpen(),
								})}
							/>
						</CollapsibleTrigger>
					</div>
				</div>
				<CollapsibleContent>
					<Switch
						checked={isRequired()}
						onChange={handleChangeIsRequired}
						class="flex items-center space-x-2"
					>
						<SwitchLabel>Required</SwitchLabel>
						<SwitchControl>
							<SwitchThumb />
						</SwitchControl>
					</Switch>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
};
