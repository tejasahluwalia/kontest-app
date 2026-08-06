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
			<FormBuilderCanvas />
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
