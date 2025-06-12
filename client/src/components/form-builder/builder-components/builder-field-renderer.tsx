import { Button } from "@client/components/ui/button";
import { Card, CardContent, CardHeader } from "@client/components/ui/card";
import { Dialog, DialogTrigger } from "@client/components/ui/dialog";
import type { Accessor, Component } from "solid-js";
import { batch, Show } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import type { InputField } from "../primitives/fields";
import FieldPropertiesModal from "./field-properties-modal";
import EllipsisVertical from "lucide-solid/icons/ellipsis-vertical";
import Trash2 from "lucide-solid/icons/trash-2";
import { Badge } from "@client/components/ui/badge";

interface BuilderFieldRendererProps {
	field: Accessor<InputField>;
	blockId: string;
	stepId: string;
}

export const BuilderFieldRenderer: Component<BuilderFieldRendererProps> = ({
	field,
	blockId,
	stepId,
}) => {
	const {
		setSelectedChildId,
		setSelectedBlockId,
		setSelectedStepId,
		removeChildFromBlock,
	} = useFormBuilder();

	const handleClick = () => {
		batch(() => {
			setSelectedStepId(stepId);
			setSelectedBlockId(blockId);
			setSelectedChildId(field().id);
		});
	};

	return (
		<Card onClick={handleClick}>
			<CardHeader class="p-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Badge variant="secondary" class="uppercase">
							{field().fieldType}
						</Badge>
						<span class="font-medium">{field().label}</span>
						<Show when={field().required}>
							<span class="text-destructive">*</span>
						</Show>
						<Show when={field().helpText}>
							<p class="text-sm text-muted-foreground">{field().helpText}</p>
						</Show>
					</div>

					<div class="flex items-center gap-2">
						<div class="space-y-2">
							<Dialog>
								<DialogTrigger>
									<Button variant="ghost" size="sm">
										<EllipsisVertical size={16} />
									</Button>
								</DialogTrigger>
								<FieldPropertiesModal
									field={field}
									blockId={blockId}
									stepId={stepId}
								/>
							</Dialog>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => {
								removeChildFromBlock(field().id, blockId, stepId);
							}}
						>
							<Trash2 size={16} />
						</Button>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
};
