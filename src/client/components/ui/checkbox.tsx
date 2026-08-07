import * as CheckboxPrimitive from "@opencenter-cloud/kobalte-core/checkbox";
import type { PolymorphicProps } from "@opencenter-cloud/kobalte-core/polymorphic";
import type { ValidComponent } from "@solidjs/web";
import { Match, omit, Switch } from "solid-js";

import { cn } from "~/lib/utils";

type CheckboxRootProps<T extends ValidComponent = "div"> =
	CheckboxPrimitive.CheckboxRootProps<T> & { class?: string | undefined };

const Checkbox = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxRootProps<T>>,
) => {
	const others = omit(props as CheckboxRootProps, "class");
	return (
		<CheckboxPrimitive.Root
			class={cn("items-top group relative flex space-x-2", props.class)}
			{...others}
		>
			<CheckboxPrimitive.Input class="peer" />
			<CheckboxPrimitive.Control class="size-4 shrink-0 rounded-xs border border-primary ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 data-[checked]:border-none data-[indeterminate]:border-none data-[checked]:bg-primary data-[indeterminate]:bg-primary data-[checked]:text-primary-foreground data-[indeterminate]:text-primary-foreground">
				<CheckboxPrimitive.Indicator>
					<Switch>
						<Match when={!others.indeterminate}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<title>Checkmark</title>
								<path d="M5 12l5 5l10 -10" />
							</svg>
						</Match>
						<Match when={others.indeterminate}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-4"
							>
								<title>Indeterminate</title>
								<path d="M5 12l14 0" />
							</svg>
						</Match>
					</Switch>
				</CheckboxPrimitive.Indicator>
			</CheckboxPrimitive.Control>
		</CheckboxPrimitive.Root>
	);
};

export { Checkbox };
