import type { PolymorphicProps } from "@opencenter-cloud/kobalte-core/polymorphic";
import * as SkeletonPrimitive from "@opencenter-cloud/kobalte-core/skeleton";
import type { ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";

import { cn } from "~/lib/utils";

type SkeletonRootProps<T extends ValidComponent = "div"> =
	SkeletonPrimitive.SkeletonRootProps<T> & { class?: string | undefined };

const Skeleton = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SkeletonRootProps<T>>,
) => {
	const others = omit(props as SkeletonRootProps, "class");
	return (
		<SkeletonPrimitive.Root
			class={cn(
				"bg-primary/10 data-[animate='true']:animate-pulse",
				props.class,
			)}
			{...others}
		/>
	);
};

export { Skeleton };
