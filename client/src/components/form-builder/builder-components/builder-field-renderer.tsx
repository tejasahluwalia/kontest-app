import { Badge } from "@client/components/ui/badge";
import { Button, type ButtonProps } from "@client/components/ui/button";
import { Card, CardContent } from "@client/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@client/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemLabel,
  DropdownMenuTrigger,
} from "@client/components/ui/dropdown-menu";
import { InlineEdit } from "@client/components/ui/inline-edit";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "@client/components/ui/switch";
import { cn } from "@client/lib/utils";
import type { PolymorphicProps } from "@kobalte/core";
import ChevronDown from "lucide-solid/icons/chevron-down";
import EllipsisVertical from "lucide-solid/icons/ellipsis-vertical";
import Trash from "lucide-solid/icons/trash";
import type { Accessor, Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import type { InputField } from "../primitives/fields";

interface BuilderFieldRendererProps {
  field: Accessor<InputField>;
  blockId: string;
  stepId: string;
}

export const BuilderFieldRenderer: Component<BuilderFieldRendererProps> = ({
  field,
  blockId,
}) => {
  const { selectedStepId, setFormSchema, saveForm, removeChildFromBlock } =
    useFormBuilder();
  const [label, setLabel] = createSignal(field().label);
  const [isRequired, setIsRequired] = createSignal(field().required || false);
  const [isOpen, setIsOpen] = createSignal(false);

  function handleUpdateLabel() {
    setFormSchema(
      "graph",
      (node) => node.step.id === selectedStepId(),
      "blocks",
      (block) => block.id === blockId,
      "children",
      (child) => child.id === field().id,
      { label: label() },
    );
    saveForm();
  }

  function handleOnDelete() {
    removeChildFromBlock(field().id, blockId, selectedStepId());
  }

  function handleChangeIsRequired(isChecked: boolean) {
    setIsRequired(isChecked);
    setFormSchema(
      "graph",
      (node) => node.step.id === selectedStepId(),
      "blocks",
      (block) => block.id === blockId,
      "children",
      (child) => child.id === field().id,
      { required: isChecked },
    );
    saveForm();
  }

  return (
    <Collapsible
      class="border p-2 rounded"
      open={isOpen()}
      onOpenChange={setIsOpen}
    >
      <div class="grid gap-4">
        <div class="flex justify-between">
          <div class="flex items-center gap-2">
            <Badge variant="secondary" class="uppercase">
              {field().fieldType}
            </Badge>
            <span class="font-medium">
              <InlineEdit
                value={label}
                setValue={setLabel}
                onSave={handleUpdateLabel}
              />
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                as={(
                  props: PolymorphicProps<"button", ButtonProps<"button">>,
                ) => <Button size="icon" variant="ghost" {...props} />}
              >
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-48">
                <DropdownMenuItem
                  onClick={handleOnDelete}
                  class="text-destructive focus:text-destructive flex justify-between"
                >
                  <DropdownMenuItemLabel>
                    <span>Delete</span>
                  </DropdownMenuItemLabel>
                  <Trash size={18} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CollapsibleTrigger
              as={(
                props: PolymorphicProps<"button", ButtonProps<"button">>,
              ) => <Button size="icon" variant="ghost" {...props} />}
            >
              <ChevronDown
                class={cn("transition-transform duration-300", {
                  "rotate-180": isOpen(),
                })}
              />
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <Switch
            checked={isRequired()}
            onChange={handleChangeIsRequired}
            class="flex items-center space-x-2"
          >
            <SwitchLabel>Required</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
