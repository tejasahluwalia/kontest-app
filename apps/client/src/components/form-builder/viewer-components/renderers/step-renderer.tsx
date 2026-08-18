import { For, Show, type StoreSetter } from "solid-js";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { InputFormData, StepGraphNode } from "../../primitives/form";
import BlockRenderer from "./block-renderer";

interface StepRendererProps {
	node: StepGraphNode;
	formData: InputFormData;
	updateFormData: StoreSetter<InputFormData>;
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
