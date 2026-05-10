import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/lib/utils";

export interface LabelProps extends ComponentProps<"label"> {}

export function Label(props: LabelProps) {
	const [local, rest] = splitProps(props, ["class", "for", "children"]);

	return (
		<label
			{...rest}
			for={local.for}
			class={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				local.class,
			)}
		>
			{local.children}
		</label>
	);
}
