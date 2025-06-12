import { createSignal, createMemo, type Component, Show } from "solid-js";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@client/components/ui/card";
import type { FormSchema, InputFormData } from "../primitives/form";
import FormNavigator from "./form-navigator";
import { Button } from "@client/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useFormBuilder } from "../form-builder-context";
import CheckCircle from "lucide-solid/icons/check-circle";
import RefreshCw from "lucide-solid/icons/refresh-cw";

interface FormPreviewProps {
	formSchema: FormSchema;
	initialData?: InputFormData;
	onClose: () => void;
}

const FormPreview: Component<FormPreviewProps> = (props) => {
	const { updatePreviewData, previewData } = useFormBuilder();
	const [isSubmitted, setIsSubmitted] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<InputFormData>({});

	// Handle form submission
	const handleSubmit = (data: InputFormData) => {
		setSubmittedData(data);
		setIsSubmitted(true);
		updatePreviewData(data);
	};

	// Reset the preview
	const handleReset = () => {
		setIsSubmitted(false);
		setSubmittedData({});
	};

	return (
		<div class="max-w-3xl mx-auto p-4">
			<Card class="w-full">
				<CardHeader>
					<CardTitle>{props.formSchema.name}</CardTitle>
					<Show when={props.formSchema.description}>
						<CardDescription>{props.formSchema.description}</CardDescription>
					</Show>
				</CardHeader>

				<CardContent>
					<Show
						when={!isSubmitted()}
						fallback={
							<div class="space-y-6">
								<Alert variant="default">
									<CheckCircle class="h-4 w-4" />
									<AlertTitle>Form Submitted Successfully</AlertTitle>
									<AlertDescription>
										Your form has been submitted with the following data:
									</AlertDescription>
								</Alert>

								<div class="bg-muted p-4 rounded-md">
									<pre class="whitespace-pre-wrap overflow-auto max-h-96">
										{JSON.stringify(submittedData(), null, 2)}
									</pre>
								</div>

								<div class="flex justify-between">
									<Button variant="outline" onClick={handleReset}>
										<RefreshCw class="mr-2 h-4 w-4" />
										Reset Preview
									</Button>
									<Button variant="outline" onClick={props.onClose}>
										Close Preview
									</Button>
								</div>
							</div>
						}
					>
						<FormNavigator
							graph={props.formSchema.graph}
							onSubmit={handleSubmit}
							initialData={previewData()}
						/>
					</Show>
				</CardContent>

				<Show when={!isSubmitted()}>
					<CardFooter class="flex justify-end">
						<Button variant="outline" onClick={props.onClose}>
							Exit Preview
						</Button>
					</CardFooter>
				</Show>
			</Card>
		</div>
	);
};

export default FormPreview;
