import server from "@client/lib/server-api";
import { useNavigate, useRouter } from "@tanstack/solid-router";
import { Show, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { createEffect } from "solid-js";
import { IconLoader } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { debounce } from "~/lib/utils";
import {
	TextField,
	TextFieldInput,
	TextFieldLabel,
} from "~/components/ui/text-field";
import { createDefaultFormSchema } from "../form-builder/primitives/form";

interface NewCallFormProps {
	orgId: string;
	onSuccess: () => void;
}

async function createCall(name: string, slug: string, orgId: string) {
	const { data, error, status } = await server.api.host
		.orgs({ orgId })
		.calls.post(
			{
				name,
				slug,
				orgId,
				schema: createDefaultFormSchema(),
			},
			{
				query: {
					orgId,
				},
			},
		);
	if (error) {
		throw error.value;
	}
	if (status !== 201) {
		throw new Error(`Failed to create call: ${status}`);
	}
	return data;
}

async function getSlugAvailability(slug: string, orgId: string) {
	const { data, error, status } = await server.api.host
		.orgs({ orgId })
		.calls.checkAvailability({ slug })
		.get();
	if (error) {
		throw error.value;
	}
	if (status !== 200) {
		throw new Error(`Failed to check slug availability: ${status}`);
	}
	return data.isAvailable;
}

export default function NewCallForm(props: NewCallFormProps) {
	const [name, setName] = createSignal("");
	const [slug, setSlug] = createSignal("");
	const [slugAvailable, setSlugAvailable] = createSignal<boolean | null>(null);
	const [checkingSlug, setCheckingSlug] = createSignal(false);
	const [slugManuallyEdited, setSlugManuallyEdited] = createSignal(false);
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const router = useRouter();
	const navigate = useNavigate();

	// Create a debounced version of the slug availability check
	const debouncedCheckSlugAvailability = debounce((...args: unknown[]) => {
		const slug = args[0] as string;
		checkSlugAvailability(slug);
	}, 500); // 500ms debounce time

	const handleInputNameChange: JSX.EventHandler<
		HTMLInputElement,
		InputEvent
	> = (event) => {
		const target = event.target as HTMLInputElement;
		setName(target.value);
		if (target.value === "") {
			setSlugAvailable(null);
			setSlugManuallyEdited(false);
		}
	};

	const handleInputSlugChange: JSX.EventHandler<
		HTMLInputElement,
		InputEvent
	> = (event) => {
		const target = event.target as HTMLInputElement;
		setSlug(target.value);
		setSlugManuallyEdited(true);
		debouncedCheckSlugAvailability(target.value);
	};

	const generateSlugFromName = async (name: string) => {
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
		setSlug(slug);
	};

	const checkSlugAvailability = async (slug: string) => {
		if (!slug) {
			setSlugAvailable(null);
			return;
		}
		setCheckingSlug(true);
		const isAvailable = await getSlugAvailability(slug, props.orgId);
		setSlugAvailable(isAvailable);
		setCheckingSlug(false);
	};

	const resetForm = () => {
		setName("");
		setSlug("");
		setSlugAvailable(null);
		setSlugManuallyEdited(false);
		setIsSubmitting(false);
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		e.stopPropagation();

		if (!name() || !slug() || slugAvailable() === false) {
			return;
		}

		setIsSubmitting(true);
		try {
			await createCall(name(), slug(), props.orgId);
			props.onSuccess();
			await router.invalidate();
		} catch (error) {
			console.error("Error creating call:", error);
			resetForm();
		} finally {
			setIsSubmitting(false);
		}
	};

	createEffect(() => {
		if (name() && !slugManuallyEdited()) {
			generateSlugFromName(name());
			debouncedCheckSlugAvailability(slug());
		}
	});

	return (
		<div class="p-4">
			<form onSubmit={handleSubmit}>
				<div class="grid gap-6">
					<TextField class="gap-2">
						<TextFieldLabel>Call Name</TextFieldLabel>
						<TextFieldInput
							name="name"
							value={name()}
							onInput={handleInputNameChange}
							type="text"
							placeholder="My Call"
							required
						/>
					</TextField>

					<TextField class="gap-2">
						<TextFieldLabel>Unique Identifier</TextFieldLabel>
						<TextFieldInput
							name="slug"
							value={slug()}
							onInput={handleInputSlugChange}
							type="text"
							placeholder="my-call"
							required
						/>
						<div class="mt-1 text-sm">
							{checkingSlug() && (
								<span class="text-gray-500">Checking availability...</span>
							)}
							{!checkingSlug() && slugAvailable() === true && (
								<span class="text-green-600">Slug is available</span>
							)}
							{!checkingSlug() && slugAvailable() === false && (
								<span class="text-red-600">Slug is not available</span>
							)}
						</div>
					</TextField>

					<Button
						type="submit"
						disabled={
							isSubmitting() || !name() || !slug() || slugAvailable() === false
						}
					>
						{isSubmitting() && <IconLoader class="mr-2 size-4 animate-spin" />}
						Create Call
					</Button>
				</div>
			</form>
		</div>
	);
}
