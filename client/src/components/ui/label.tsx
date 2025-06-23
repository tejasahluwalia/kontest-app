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
				"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 inline-block mb-2",
				local.class,
			)}
		>
			{local.children}
		</label>
	);
}
