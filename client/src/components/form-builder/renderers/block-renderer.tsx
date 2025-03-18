import { For, type Component } from "solid-js";
import type { Block } from "../primitives/blocks";
import ChildRenderer from "./child-renderer";
import { useFormBuilder } from "../form-builder-context";
import { Button } from "@client/components/ui/button";
import { createChild } from "../primitives/children";

const BlockRenderer: Component<{block: Block}> = ({block}) =>  {
    const { setSelectedBlockId, addChildToBlock } = useFormBuilder()
    const { id, children } = block;
    return (
        <div onClick={() => setSelectedBlockId(id)} class="flex items-center justify-between gap-1">
            <div class="grid">
                <div>
                  Block {id}
                </div>
                <For each={children}>
                    {(child) => (
                        <ChildRenderer child={child} />
                    )}
                </For>
                <Button variant="outline" onClick={() => addChildToBlock(createChild(), id)}>
                    Add Child
                </Button>
            </div>
        </div>
    );
}

export default BlockRenderer;