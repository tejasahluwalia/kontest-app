import { createSignal, For, Show } from "solid-js";
import type { FormGraph, StepGraphNode } from "../../primitives/form";
import { useFormBuilder } from "../../form-builder-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";
import { createChildren } from "../../primitives/children";
import { createId } from "@paralleldrive/cuid2";
import { Button } from "~/components/ui/button";
import BlockRenderer from "./block-renderer";

export default function StepRenderer(props: StepGraphNode) {
    const { step, blocks, edges } = props;
    const { selectedStepId, setSelectedStepId, updateStepInGraph, addBlockToStep } = useFormBuilder();
    const [isEditingTitle, setIsEditingTitle] = createSignal(false);
    const [isEditingDescription, setIsEditingDescription] = createSignal(false);

    const isActive = () => selectedStepId() === step.id;

    return (
      <Card
        class={`transition-all ${isActive() ? "ring-2 ring-primary" : ""}`}
        onClick={() => setSelectedStepId(step.id)}
      >
        <CardHeader class="relative">
          <Show
            when={!isEditingTitle()}
            fallback={
              <Input
                value={step.label}
                onInput={(e) => updateStepInGraph(step.id, { label: e.currentTarget.value })}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e: KeyboardEvent) => e.key === "Enter" && setIsEditingTitle(false)}
                autofocus
              />
            }
          >
            <CardTitle
              class="cursor-pointer hover:text-primary"
              onClick={() => isActive() && setIsEditingTitle(true)}
            >
              {step.label}
            </CardTitle>
          </Show>

          <Show
            when={!isEditingDescription()}
            fallback={
              <TextField>
                <TextFieldTextArea
                  value={step.description || ""}
                  onInput={(e) => updateStepInGraph(step.id, { description: e.currentTarget.value })}
                  onBlur={() => setIsEditingDescription(false)}
                  rows={3}
                  autofocus
                />
              </TextField>
            }
          >
            <Show when={step.description}>
              <CardDescription
                class="cursor-pointer hover:text-primary"
                onClick={() => isActive() && setIsEditingDescription(true)}
              >
                {step.description}
              </CardDescription>
            </Show>
            <Show when={!step.description && isActive()}>
              <button
                class="text-sm text-muted-foreground hover:text-primary"
                onClick={() => setIsEditingDescription(true)}
              >
                Edit description
              </button>
            </Show>
          </Show>
        </CardHeader>

        <CardContent>
          <Show when={blocks.length > 0} fallback={
            <div class="py-8 flex flex-col items-center justify-center border border-dashed rounded-md">
              <p class="text-muted-foreground mb-4">No blocks added to this step yet</p>
            </div>
          }>
            <div class="space-y-4">
              <For each={blocks}>
                {(block) => (
                  <BlockRenderer block={block} stepId={step.id} />
                )}
              </For>
            </div>
          </Show>
        </CardContent>
        <CardFooter>
            <div class="flex items-center justify-between gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addBlockToStep({
                  id: createId(),
                  children: createChildren()
                }, step.id)}
              >
                Add Block
              </Button>
            </div>
        </CardFooter>
      </Card>
    );
  }