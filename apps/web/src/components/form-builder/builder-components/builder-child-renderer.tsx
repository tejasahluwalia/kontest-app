import { Button } from "~/components/ui/button";
import Trash from "lucide-solid/icons/trash";
import { batch, type Component, Match, Show, Switch } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import type { Child } from "../primitives/children";
import { BuilderFieldRenderer } from "./builder-field-renderer";

interface BuilderChildRendererProps {
	child: Child;
	blockId: string;
}

const BuilderChildRenderer: Component<BuilderChildRendererProps> = ({
	child,
	blockId,
}) => {
	const {
		setSelectedChildId,
		setSelectedBlockId,
		selectedStepId,
		removeChildFromBlock,
	} = useFormBuilder();
	const { id } = child;

	const handleOnDelete = () => {
		batch(() => {
			removeChildFromBlock(id, blockId, selectedStepId());
			setSelectedChildId("");
		});
	};

	const handleOnSelect = () => {
		batch(() => {
			setSelectedBlockId(blockId);
			setSelectedChildId(id);
		});
	};

	return (
		<Switch>
			<Match when={child.childType === "field"}>
				<Show
					when={(() => {
						if (child.childType === "field") {
							return child;
						}
						return null;
					})()}
				>
					{(field) => (
						<BuilderFieldRenderer
							field={field}
							blockId={blockId}
							stepId={selectedStepId()}
						/>
					)}
				</Show>
			</Match>
			<Match when={child.childType === "display"}>
				<div
					class={`border p-4 rounded-md relative transition-all group/child border-border hover:border-muted-foreground"}`}
				>
					<div class="w-full h-full">
						<p class="text-muted-foreground">Display component: {id}</p>
						<p class="text-sm text-muted-foreground">
							This display type is not implemented yet
						</p>
					</div>

					<div class="absolute top-2 right-2">
						<Button
							variant="secondary"
							size="icon"
							class="transition-opacity group-hover/child:opacity-100 opacity-0"
							onClick={handleOnDelete}
						>
							<Trash />
						</Button>
					</div>
				</div>
			</Match>
		</Switch>
	);
};

export default BuilderChildRenderer;
