import type { Component } from "solid-js";
import type { Child } from "../primitives/children";
import { useFormBuilder } from "../form-builder-context";

const ChildRenderer: Component<{child: Child}> = ({child}) =>  {
    const { setSelectedChildId } = useFormBuilder()
    const { id } = child;
    return (
        <div onClick={() => setSelectedChildId(id)} class="flex items-center justify-between gap-1">
            <div class="w-4 h-4 bg-muted rounded-full" />
            Child {id}
        </div>
    );
};

export default ChildRenderer;