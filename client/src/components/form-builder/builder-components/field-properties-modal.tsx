import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@client/components/ui/dialog";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@client/components/ui/tabs";
import { Switch as ToggleSwitch } from "@client/components/ui/switch";
import { createSignal, For, Switch } from "solid-js";
import { Label } from "@client/components/ui/label";
import { Show } from "solid-js";
import { Input } from "@client/components/ui/input";
import type { ParentComponent, Accessor } from "solid-js";
import type { FieldOption, InputField } from "../primitives/fields";
import { useFormBuilder } from "../form-builder-context";
import { Button } from "@client/components/ui/button";
import { nanoid } from "nanoid";

const FieldPropertiesModal: ParentComponent<{
	field: Accessor<InputField>;
	blockId: string;
	stepId: string;
}> = (props) => {
	const { updateChildInBlock } = useFormBuilder();
	const [activeTab, setActiveTab] = createSignal("general");
	const { field, blockId, stepId } = props;

	const handleUpdateField = (data: Partial<InputField>) => {
		updateChildInBlock(field().id, blockId, data, stepId);
	};

	const handleAddOption = () => {
		if (!field().options) return;

		const newOption: FieldOption = {
			id: nanoid(),
			label: `Option ${(field().options?.length || 0) + 1}`,
			value: `option_${(field().options?.length || 0) + 1}`,
		};

		const updatedOptions = [...(field().options || []), newOption];
		handleUpdateField({ options: updatedOptions });
	};

	const handleUpdateOption = (optionId: string, data: Partial<FieldOption>) => {
		if (!field().options) return;

		const updatedOptions = (field().options || []).map((option) =>
			option.id === optionId ? { ...option, ...data } : option,
		);

		handleUpdateField({ options: updatedOptions });
	};

	const handleRemoveOption = (optionId: string) => {
		if (!field().options) return;

		const updatedOptions = (field().options || []).filter(
			(option) => option.id !== optionId,
		);
		handleUpdateField({ options: updatedOptions });
	};
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Field Properties</DialogTitle>
			</DialogHeader>
			<DialogContent>
				<Tabs value={activeTab()} onChange={setActiveTab}>
					<TabsList class="w-full mb-4">
						<TabsTrigger value="general" class="flex-1">
							General
						</TabsTrigger>
						<TabsTrigger value="validation" class="flex-1">
							Validation
						</TabsTrigger>
						<Show
							when={["select", "checkbox", "radio"].includes(
								(field().fieldType || "").toLowerCase(),
							)}
						>
							<TabsTrigger value="options" class="flex-1">
								Options
							</TabsTrigger>
						</Show>
						<TabsTrigger value="conditional" class="flex-1">
							Conditional
						</TabsTrigger>
					</TabsList>

					{/* General Tab */}
					<TabsContent value="general" class="space-y-4">
						<div>
							<Label for="field-label">Label</Label>
							<Input
								id="field-label"
								value={field().label}
								onInput={(e) =>
									handleUpdateField({ label: e.currentTarget.value })
								}
							/>
						</div>

						<div>
							<Label for="field-name">Field Name</Label>
							<Input id="field-name" value={field().id} disabled />
							<p class="text-xs text-muted-foreground mt-1">
								Field identifier in form submissions
							</p>
						</div>

						<div>
							<Label for="field-placeholder">Placeholder</Label>
							<Input
								id="field-placeholder"
								value={field().placeholder || ""}
								onInput={(e) =>
									handleUpdateField({ placeholder: e.currentTarget.value })
								}
							/>
						</div>

						<div>
							<Label for="field-help-text">Help Text</Label>
							<Input
								id="field-help-text"
								value={field().helpText || ""}
								onInput={(e) =>
									handleUpdateField({ helpText: e.currentTarget.value })
								}
							/>
						</div>

						<div>
							<Label for="field-description">Description</Label>
							<Input
								id="field-description"
								value={field().description || ""}
								onInput={(e) =>
									handleUpdateField({ description: e.currentTarget.value })
								}
							/>
						</div>

						<Show when={field().defaultValue !== undefined}>
							<div>
								<Label for="field-default-value">Default Value</Label>
								<Input
									id="field-default-value"
									value={
										typeof field().defaultValue === "object"
											? JSON.stringify(field().defaultValue)
											: String(field().defaultValue || "")
									}
									onInput={(e) =>
										handleUpdateField({ defaultValue: e.currentTarget.value })
									}
								/>
							</div>
						</Show>
					</TabsContent>

					{/* Validation Tab */}
					<TabsContent value="validation" class="space-y-4">
						<div class="flex items-center justify-between">
							<Label for="field-required">Required</Label>
							<ToggleSwitch
								name="field-required"
								checked={field().required || false}
								onChange={(isChecked) =>
									handleUpdateField({ required: isChecked })
								}
							/>
						</div>

						<Show
							when={["text", "rich-text"].includes(
								field().fieldType.toLowerCase(),
							)}
						>
							<div>
								<Label for="field-min-length">Minimum Length</Label>
								<Input
									id="field-min-length"
									type="number"
									value={field().validation?.minLength || ""}
									onInput={(e) => {
										const minLength = e.currentTarget.value
											? Number(e.currentTarget.value)
											: undefined;
										handleUpdateField({ minLength });
									}}
								/>
							</div>

							<div>
								<Label for="field-max-length">Maximum Length</Label>
								<Input
									id="field-max-length"
									type="number"
									value={field().validation?.maxLength || ""}
									onInput={(e) => {
										const maxLength = e.currentTarget.value
											? Number(e.currentTarget.value)
											: undefined;
										handleUpdateField({ maxLength });
									}}
								/>
							</div>
						</Show>

						<Show when={field().fieldType.toLowerCase() === "number"}>
							<div>
								<Label for="field-min">Minimum Value</Label>
								<Input
									id="field-min"
									type="number"
									value={field().validation?.min || ""}
									onInput={(e) => {
										const min = e.currentTarget.value
											? Number(e.currentTarget.value)
											: undefined;
										handleUpdateField({ min });
									}}
								/>
							</div>

							<div>
								<Label for="field-max">Maximum Value</Label>
								<Input
									id="field-max"
									type="number"
									value={field().validation?.max || ""}
									onInput={(e) => {
										const max = e.currentTarget.value
											? Number(e.currentTarget.value)
											: undefined;
										handleUpdateField({ max });
									}}
								/>
							</div>
						</Show>
					</TabsContent>

					{/* Options Tab */}
					<TabsContent value="options" class="space-y-4">
						<Show
							when={(() => {
								const f = field();
								if (!f || f.childType !== "field") return null;
								if (
									f.fieldType == "select" ||
									f.fieldType == "radio" ||
									f.fieldType == "checkbox"
								) {
									return f;
								}
								return null;
							})()}
						>
							{(fieldWithOptions) => (
								<div class="space-y-2">
									<For each={fieldWithOptions().options || []}>
										{(option) => (
											<div class="flex items-center gap-2">
												<Input
													value={option.label}
													onInput={(e) =>
														handleUpdateOption(option.id, {
															label: e.currentTarget.value,
														})
													}
													placeholder="Option label"
												/>
												<Input
													value={option.value}
													onInput={(e) =>
														handleUpdateOption(option.id, {
															value: e.currentTarget.value,
														})
													}
													placeholder="Option value"
												/>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleRemoveOption(option.id)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													>
														<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
													</svg>
												</Button>
											</div>
										)}
									</For>

									<Button
										variant="outline"
										class="w-full"
										onClick={handleAddOption}
									>
										Add Option
									</Button>
								</div>
							)}
						</Show>
					</TabsContent>

					{/* Conditional Tab */}
					<TabsContent value="conditional" class="space-y-4">
						<p class="text-muted-foreground">
							Conditional logic allows you to show or hide this field based on
							other field values. (Coming soon)
						</p>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</DialogContent>
	);
};

export default FieldPropertiesModal;
