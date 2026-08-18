import type { ComponentProps } from "@solidjs/web";
import { omit } from "solid-js";

import { cn } from "~/lib/utils";

export interface LabelProps extends ComponentProps<"label"> {}

export function Label(props: LabelProps) {
	const rest = omit(props, "class", "for", "children");

	return (
		<label
			{...rest}
			for={props.for}
			class={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				props.class,
			)}
		>
			{props.children}
		</label>
	);
}
