import * as DialogPrimitive from "@kobalte/core/dialog";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { merge, omit, Show } from "solid-js";
import { cx } from "~/lib/utils";

export const DialogPortal = DialogPrimitive.Portal;

export type DialogProps = DialogPrimitive.DialogRootProps;

export const Dialog = (props: DialogProps) => {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

export type DialogTriggerProps<T extends ValidComponent = "button"> =
	DialogPrimitive.DialogTriggerProps<T>;

export const DialogTrigger = <T extends ValidComponent = "button">(
	props: PolymorphicProps<T, DialogTriggerProps<T>>,
) => {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

export type DialogCloseButtonProps<T extends ValidComponent = "button"> =
	DialogPrimitive.DialogCloseButtonProps<T>;

export const DialogCloseButton = <T extends ValidComponent = "button">(
	props: PolymorphicProps<T, DialogCloseButtonProps<T>>,
) => {
	return <DialogPrimitive.CloseButton data-slot="dialog-close" {...props} />;
};

export type DialogOverlayProps<T extends ValidComponent = "div"> =
	DialogPrimitive.DialogOverlayProps<T> & {
		class?: string;
	};

export const DialogOverlay = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DialogOverlayProps<T>>,
) => {
	const rest = omit(props as DialogOverlayProps, "class");
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			class={cx(
				"data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				props.class,
			)}
			{...rest}
		/>
	);
};

export type DialogContentProps<T extends ValidComponent = "div"> =
	DialogPrimitive.DialogContentProps<T> & {
		showCloseButton?: boolean;
		class?: string;
		children?: JSX.Element;
	};

export const DialogContent = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DialogContentProps<T>>,
) => {
	const merged = merge(
		{
			showCloseButton: true,
		} as DialogContentProps,
		props,
	);
	const rest = omit(
		merged as DialogContentProps,
		"class",
		"children",
		"showCloseButton",
	);

	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				class={cx(
					"bg-background data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
					merged.class,
				)}
				{...rest}
			>
				{merged.children}
				<Show when={merged.showCloseButton}>
					<DialogPrimitive.CloseButton
						aria-label="Close"
						class="rounded-xs focus-visible:ring-ring absolute right-4 top-4 opacity-70 transition-[opacity,box-shadow] duration-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<title>Close</title>
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 6L6 18M6 6l12 12"
							/>
						</svg>
					</DialogPrimitive.CloseButton>
				</Show>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
};

export type DialogHeaderProps = ComponentProps<"div">;

export const DialogHeader = (props: DialogHeaderProps) => {
	const rest = omit(props, "class");

	return (
		<div
			data-slot="dialog-header"
			class={cx("flex flex-col gap-2 text-center sm:text-left", props.class)}
			{...rest}
		/>
	);
};

export type DialogFooterProps = ComponentProps<"div">;

export const DialogFooter = (props: DialogFooterProps) => {
	const rest = omit(props, "class");

	return (
		<div
			data-slot="dialog-footer"
			class={cx(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				props.class,
			)}
			{...rest}
		/>
	);
};

export type DialogTitleProps<T extends ValidComponent = "h2"> =
	DialogPrimitive.DialogTitleProps<T> & {
		class?: string;
	};

export const DialogTitle = <T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, DialogTitleProps<T>>,
) => {
	const rest = omit(props as DialogTitleProps, "class");

	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			class={cx("text-lg font-semibold leading-none", props.class)}
			{...rest}
		/>
	);
};

export type DialogDescriptionProps<T extends ValidComponent = "p"> =
	DialogPrimitive.DialogDescriptionProps<T> & {
		class?: string;
	};

export const DialogDescription = <T extends ValidComponent = "p">(
	props: PolymorphicProps<T, DialogDescriptionProps<T>>,
) => {
	const rest = omit(props as DialogDescriptionProps, "class");

	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			class={cx("text-muted-foreground text-sm", props.class)}
			{...rest}
		/>
	);
};
