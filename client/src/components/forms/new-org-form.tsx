import server from "@client/lib/server-api";
import { redirect, useRouter } from "@tanstack/solid-router";
import type { JSX } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { IconLoader } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
	TextField,
	TextFieldInput,
	TextFieldLabel,
} from "~/components/ui/text-field";
import { debounce } from "~/lib/utils";

async function createOrg(name: string, slug: string) {
	const { data, error } = await server.api.host.orgs.post({
		name,
		slug,
	});
	if (error) {
		throw error.value;
	}

	const newOrg = data[0];
	return redirect({
		to: "/host/orgs/$org",
		params: {
			org: newOrg.slug,
		},
	});
}

async function getSlugAvailability(slug: string) {
	const { data, error, status } = await server.api.host.orgs
		.checkAvailability({ slug })
		.get();
	if (error) {
		throw error.value;
	}
	if (status !== 200) {
		throw new Error(`Failed to check slug availability: ${status}`);
	}
	return data.isAvailable;
}

export default function NewOrgForm() {
	const [name, setName] = createSignal("");
	const [slug, setSlug] = createSignal("");
	const [slugAvailable, setSlugAvailable] = createSignal<boolean | null>(null);
	const [checkingSlug, setCheckingSlug] = createSignal(false);
	const [slugManuallyEdited, setSlugManuallyEdited] = createSignal(false);
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const router = useRouter();

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
		const newSlug = generateSlugFromName(target.value);
		setSlug(newSlug);
		setSlugManuallyEdited(true);
		debouncedCheckSlugAvailability(newSlug);
	};

	const generateSlugFromName = (name: string) => {
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
		return slug;
	};

	const checkSlugAvailability = async (slug: string) => {
		if (!slug) {
			setSlugAvailable(null);
			return;
		}
		setCheckingSlug(true);
		const isAvailable = await getSlugAvailability(slug);
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
			await createOrg(name(), slug());
		} catch (error) {
			console.error("Error creating org:", error);
			resetForm();
		} finally {
			setIsSubmitting(false);
			router.invalidate();
			resetForm();
		}
	};

	createEffect(() => {
		if (name() && !slugManuallyEdited()) {
			const slug = generateSlugFromName(name());
			setSlug(slug);
			debouncedCheckSlugAvailability(slug);
		}
	});

	return (
		<div class="p-4">
			<form onSubmit={handleSubmit}>
				<div class="grid gap-6">
					<TextField class="gap-2">
						<TextFieldLabel>Org Display Name</TextFieldLabel>
						<TextFieldInput
							name="name"
							value={name()}
							onInput={handleInputNameChange}
							type="text"
							placeholder="My Org"
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
							placeholder="my-org"
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
						Create Org
					</Button>
				</div>
			</form>
		</div>
	);
}
