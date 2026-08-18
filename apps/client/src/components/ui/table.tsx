import type { ComponentProps } from "@solidjs/web";
import { omit } from "solid-js";
import { cn } from "~/lib/utils";

export const Table = (props: ComponentProps<"table">) => {
	const rest = omit(props, "class");

	return (
		<div class="w-full overflow-auto">
			<table
				class={cn("w-full caption-bottom text-sm", props.class)}
				{...rest}
			/>
		</div>
	);
};

export const TableHeader = (props: ComponentProps<"thead">) => {
	const rest = omit(props, "class");

	return <thead class={cn("[&_tr]:border-b", props.class)} {...rest} />;
};

export const TableBody = (props: ComponentProps<"tbody">) => {
	const rest = omit(props, "class");

	return (
		<tbody class={cn("[&_tr:last-child]:border-0", props.class)} {...rest} />
	);
};

export const TableFooter = (props: ComponentProps<"tfoot">) => {
	const rest = omit(props, "class");

	return (
		<tbody
			class={cn("bg-primary font-medium text-primary-foreground", props.class)}
			{...rest}
		/>
	);
};

export const TableRow = (props: ComponentProps<"tr">) => {
	const rest = omit(props, "class");

	return (
		<tr
			class={cn(
				"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
				props.class,
			)}
			{...rest}
		/>
	);
};

export const TableHead = (props: ComponentProps<"th">) => {
	const rest = omit(props, "class");

	return (
		<th
			class={cn(
				"h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				props.class,
			)}
			{...rest}
		/>
	);
};

export const TableCell = (props: ComponentProps<"td">) => {
	const rest = omit(props, "class");

	return (
		<td
			class={cn(
				"p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				props.class,
			)}
			{...rest}
		/>
	);
};

export const TableCaption = (props: ComponentProps<"caption">) => {
	const rest = omit(props, "class");

	return (
		<caption
			class={cn("mt-4 text-sm text-muted-foreground", props.class)}
			{...rest}
		/>
	);
};
