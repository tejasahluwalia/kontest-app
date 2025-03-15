import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";

import { cn } from "~/lib/utils";

export interface LabelProps extends ComponentProps<"label"> {}

export function Label(props: LabelProps) {
	const [, rest] = splitProps(props, ["class"]);

	return (
		<label
			{...rest}
			class={cn(
				"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
				props.class
			)}
		/>
	);
}
