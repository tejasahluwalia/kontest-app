import { FormBuilderCanvas } from "./form-builder-canvas";
import { FormBuilderProvider, useFormBuilder } from "./form-builder-context";
import type { FormSchema } from "./primitives/form";

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
