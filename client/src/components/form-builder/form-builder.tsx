import { Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FormBuilderCanvas } from "./form-builder-canvas";
import { FormBuilderProvider, useFormBuilder } from "./form-builder-context";
import { FormFlowCanvas } from "./form-flow-editor/form-flow-canvas";
import { FormSettings } from "./form-settings";
import type { FormSchema } from "./primitives/form";
import FormPreview from "./viewer-components/form-preview";

interface FormBuilderProps {
	initialSchema: FormSchema;
}

function FormBuilderContent() {
	const { formSchema, isPreviewMode, startPreview, stopPreview, saveForm } =
		useFormBuilder();

	return (
		<div class="space-y-6">
			<Tabs defaultValue="flow" class="w-full">
				<TabsList class="w-full max-w-md mx-auto">
					<TabsTrigger value="flow" class="flex-1">
						Form Flow
					</TabsTrigger>
					<TabsTrigger value="builder" class="flex-1">
						Form Builder
					</TabsTrigger>
					<TabsTrigger value="settings" class="flex-1">
						Form Settings
					</TabsTrigger>
					<TabsTrigger value="preview" class="flex-1">
						Preview
					</TabsTrigger>
				</TabsList>

				<TabsContent value="flow" class="pt-6">
					<div class="grid">
						<FormFlowCanvas />
					</div>
				</TabsContent>

				<TabsContent value="builder" class="pt-6">
					<div class="grid">
						<FormBuilderCanvas />
					</div>
				</TabsContent>

				<TabsContent value="settings" class="pt-6">
					<FormSettings />
				</TabsContent>

				<TabsContent value="preview" class="pt-6">
					<Show
						when={isPreviewMode()}
						fallback={
							<div class="border rounded-lg p-6 text-center">
								<p class="text-muted-foreground mb-4">
									Preview your form to test the conditional logic and navigation
									flow
								</p>
								<Button onClick={startPreview}>Start Preview</Button>
							</div>
						}
					>
						<FormPreview formSchema={formSchema} onClose={stopPreview} />
					</Show>
				</TabsContent>
			</Tabs>
			<Button onclick={saveForm}>Save Form</Button>
		</div>
	);
}

export function FormBuilder(props: FormBuilderProps) {
	return (
		<FormBuilderProvider initialSchema={props.initialSchema}>
			<FormBuilderContent />
		</FormBuilderProvider>
	);
}
