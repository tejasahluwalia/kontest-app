import { createSignal, For, Show } from "solid-js";
import type { SetStoreFunction } from "~/compat/solid-store";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";
import { useFormBuilder } from "../../form-builder-context";
import { createChildren } from "../../primitives/children";
import type {
	FormGraph,
	InputFormData,
	StepGraphNode,
} from "../../primitives/form";
import BlockRenderer from "./block-renderer";

interface StepRendererProps {
	node: StepGraphNode;
	formData: InputFormData;
	updateFormData: SetStoreFunction<InputFormData>;
}

export default function StepRenderer(props: StepRendererProps) {
	const { node, formData, updateFormData } = props;
	const { step, blocks } = node;

	return (
		<Card>
			<CardHeader class="relative">
				<CardTitle class="cursor-pointer hover:text-primary">
					{step.label}
				</CardTitle>
				<Show when={step.description}>
					<CardDescription class="cursor-pointer hover:text-primary">
						{step.description}
					</CardDescription>
				</Show>
			</CardHeader>

			<CardContent>
				<Show
					when={blocks.length > 0}
					fallback={
						<div class="py-8 flex flex-col items-center justify-center border border-dashed rounded-md">
							<p class="text-muted-foreground mb-4">
								No blocks added to this step yet
							</p>
						</div>
					}
				>
					<div class="space-y-4">
						<For each={blocks}>
							{(block) => (
								<BlockRenderer
									block={block}
									stepId={step.id}
									formData={formData}
									updateFormData={updateFormData}
								/>
							)}
						</For>
					</div>
				</Show>
			</CardContent>
		</Card>
	);
}
