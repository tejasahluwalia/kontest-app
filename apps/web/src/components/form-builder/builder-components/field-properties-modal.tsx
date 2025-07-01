import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch as ToggleSwitch } from "~/components/ui/switch";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/ui/tabs";
import type { Accessor, ParentComponent } from "solid-js";
import { createSignal, Show } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import type { InputField } from "../primitives/fields";

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
							<Input id="field-name" value={field().name} />
							<p class="text-xs text-muted-foreground mt-1">
								Field identifier in form submissions
							</p>
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
