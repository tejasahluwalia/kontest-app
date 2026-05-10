import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { InlineEdit } from "~/components/ui/inline-edit";
import ArrowRight from "lucide-solid/icons/arrow-right";
import Plus from "lucide-solid/icons/plus";
import Trash from "lucide-solid/icons/trash";
import {
	createEffect,
	createMemo,
	createSignal,
	ErrorBoundary,
	For,
} from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import type { ConditionalRule } from "../primitives/conditions";
import type { Edges } from "../primitives/edges";
import {
	createDefaultStepNodeGraph,
	type StepGraphNode,
} from "../primitives/form";
import { ConnectionEditorModal } from "./connection-editor-modal";

export function FormFlowCanvas() {
	const {
		formSchema,
		addStepToGraph,
		removeStepFromGraph,
		setSelectedStepId,
		selectedStepId,
		addEdgeToStep,
		removeEdgeFromStep,
		updateEdgeInStep,
		updateStepInGraph,
	} = useFormBuilder();

	const graphNodes = createMemo(() => Object.values(formSchema.graph));

	// Handle adding a new step to the graph
	const handleAddStep = () => {
		const newStep = createDefaultStepNodeGraph();
		addStepToGraph(newStep);
		setSelectedStepId(newStep.step.id);
	};

	// Handle removing a step from the graph
	const handleRemoveStep = (stepId: string) => {
		if (graphNodes().length <= 1) {
			return; // Don't remove the last step
		}

		// Remove the step
		removeStepFromGraph(stepId);

		// If we removed the selected step, select the first one
		if (selectedStepId() === stepId) {
			const firstStepId = Object.keys(formSchema.graph)[0];
			if (firstStepId) {
				setSelectedStepId(firstStepId);
			}
		}
	};

	return (
		<div>
			<div class="flex flex-col gap-6">
				<For each={graphNodes()}>
					{(node) => (
						<StepNode
							node={node}
							allNodes={graphNodes()}
							isSelected={selectedStepId() === node.step.id}
							onSelect={() => setSelectedStepId(node.step.id)}
							onRemove={() => handleRemoveStep(node.step.id)}
							onAddEdge={addEdgeToStep}
							onRemoveEdge={removeEdgeFromStep}
							onUpdate={(stepId, edges) => updateStepInGraph(stepId, { edges })}
						/>
					)}
				</For>
			</div>

			<div class="flex justify-center mt-4">
				<Button
					variant="outline"
					onClick={handleAddStep}
					class="w-full max-w-md"
				>
					<Plus class="mr-2 h-4 w-4" />
					Add Step
				</Button>
			</div>
		</div>
	);
}

// Component for rendering a single step node
function StepNode(props: {
	node: StepGraphNode;
	allNodes: StepGraphNode[];
	isSelected: boolean;
	onSelect: () => void;
	onRemove: () => void;
	onAddEdge: (edge: ConditionalRule, sourceStepId: string) => void;
	onRemoveEdge: (edgeId: string, sourceStepId: string) => void;
	onUpdate: (stepId: string, edges: Edges) => void;
}) {
	const { updateStepInGraph } = useFormBuilder();
	// State for the connection editor modal
	const [isConnectionModalOpen, setIsConnectionModalOpen] = createSignal(false);
	// Get list of available target steps (all steps except this one)
	const availableTargets = createMemo(() =>
		props.allNodes.filter((n) => n.step.id !== props.node.step.id),
	);

	function openModal() {
		setIsConnectionModalOpen(true);
	}

	const [label, setLabel] = createSignal(props.node.step.label);

	createEffect(() => {
		updateStepInGraph(props.node.step.id, {
			step: { ...props.node.step, label: label() },
		});
	});

	return (
		<Card onClick={props.onSelect}>
			<CardContent class="p-4">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center">
						<InlineEdit
							value={label}
							onSave={setLabel}
							displayComponent={({ value }) => (
								<h3 class="text-lg font-medium">{value}</h3>
							)}
						/>
					</div>

					<Button
						variant="ghost"
						size="icon"
						onClick={props.onRemove}
						disabled={props.allNodes.length <= 1}
					>
						<Trash class="h-4 w-4" />
					</Button>
				</div>

				{/* Edges/Connections */}
				<div class="space-y-2 mt-4">
					<div class="flex items-center">
						<h4 class="text-sm font-medium text-muted-foreground">
							Connections
						</h4>
						<Button variant="ghost" size="icon" onClick={openModal}>
							<Plus class="h-2 w-2" />
						</Button>
					</div>

					<div class="space-y-2">
						<For each={props.node.edges}>
							{(edge) => {
								if (edge.action.id === "submit") {
									return "Submit"
								}
								const targetStep = props.allNodes.find(
									(n) => n.step.id === edge.action.id,
								);
								return (
									<div class="flex items-center gap-2">
										<ArrowRight class="h-4 w-4 text-muted-foreground" />
										<span class="flex-1">
											{targetStep ? targetStep.step.label : "Unknown Step"}
										</span>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												props.onRemoveEdge(edge.action.id, props.node.step.id)
											}
										>
											<Trash class="h-3 w-3" />
										</Button>
									</div>
								);
							}}
						</For>
					</div>
					<ErrorBoundary fallback={<div>Something went wrong</div>}>
						{/* Edit connections button */}
						<div class="flex items-center gap-2 mt-3">
							{/* Connection Editor Modal */}
							<ConnectionEditorModal
								open={isConnectionModalOpen()}
								onOpenChange={setIsConnectionModalOpen}
								sourceStep={props.node}
								availableSteps={availableTargets()}
								onSave={(edges) => props.onUpdate(props.node.step.id, edges)}
							/>
						</div>
					</ErrorBoundary>
				</div>
			</CardContent>
		</Card>
	);
}
