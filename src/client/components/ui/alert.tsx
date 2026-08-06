import type { JSX } from "@solidjs/web";
import { type Component, omit } from "solid-js";
import { cn } from "~/lib/utils";

const Alert: Component<
	JSX.HTMLAttributes<HTMLDivElement> & {
		variant?: "default" | "destructive";
	}
> = (props) => {
	const others = omit(props, "class", "variant", "children");
	return (
		<div
			role="alert"
			class={cn(
				"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
				{
					"bg-background text-foreground": props.variant === "default",
					"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive":
						props.variant === "destructive",
				},
				props.class,
			)}
			{...others}
		>
			{props.children}
		</div>
	);
};

const AlertTitle: Component<JSX.HTMLAttributes<HTMLHeadingElement>> = (
	props,
) => {
	const others = omit(props, "class", "children");
	return (
		<h5
			class={cn("mb-1 font-medium leading-none tracking-tight", props.class)}
			{...others}
		>
			{props.children}
		</h5>
	);
};

const AlertDescription: Component<JSX.HTMLAttributes<HTMLParagraphElement>> = (
	props,
) => {
	const others = omit(props, "class", "children");
	return (
		<div class={cn("text-sm [&_p]:leading-relaxed", props.class)} {...others}>
			{props.children}
		</div>
	);
};

export { Alert, AlertDescription, AlertTitle };
