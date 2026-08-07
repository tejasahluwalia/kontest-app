import type { PolymorphicProps } from "@opencenter-cloud/kobalte-core/polymorphic";
import * as SeparatorPrimitive from "@opencenter-cloud/kobalte-core/separator";
import type { ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";

import { cn } from "~/lib/utils";

type SeparatorRootProps<T extends ValidComponent = "hr"> =
	SeparatorPrimitive.SeparatorRootProps<T> & { class?: string | undefined };

const Separator = <T extends ValidComponent = "hr">(
	props: PolymorphicProps<T, SeparatorRootProps<T>>,
) => {
	const others = omit(props as SeparatorRootProps, "class", "orientation");
	return (
		<SeparatorPrimitive.Root
			orientation={props.orientation ?? "horizontal"}
			class={cn(
				"shrink-0 bg-border",
				props.orientation === "vertical" ? "h-full w-px" : "h-px w-full",
				props.class,
			)}
			{...others}
		/>
	);
};

export { Separator };
