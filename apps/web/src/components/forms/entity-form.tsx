import { useRouter } from "@tanstack/solid-router";
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

interface EntityFormProps<T = unknown> {
	entityName: string; // e.g., "Org", "Call", "Round"
	createEntity: (name: string, slug: string) => Promise<T>;
	checkSlugAvailability: (slug: string) => Promise<boolean>;
	onSuccess?: (createdEntity: T) => void | Promise<void>;
	autoInvalidate?: boolean; // Default: true
}

export default function EntityForm<T = unknown>(props: EntityFormProps<T>) {
	const [name, setName] = createSignal("");
	const [slug, setSlug] = createSignal("");
	const [slugAvailable, setSlugAvailable] = createSignal<boolean | null>(null);
	const [checkingSlug, setCheckingSlug] = createSignal(false);
	const [slugManuallyEdited, setSlugManuallyEdited] = createSignal(false);
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const router = useRouter();

	const checkSlugAvailabilityInternal = async (slug: string) => {
		if (!slug) {
			setSlugAvailable(null);
			return;
		}
		setCheckingSlug(true);
		try {
			const isAvailable = await props.checkSlugAvailability(slug);
			setSlugAvailable(isAvailable);
		} catch (error) {
			console.error("Error checking slug availability:", error);
			setSlugAvailable(null);
		} finally {
			setCheckingSlug(false);
		}
	};

	// Create a debounced version of the slug availability check
	const debouncedCheckSlugAvailability = debounce(
		checkSlugAvailabilityInternal,
		500,
	);

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
		if (target.value === "") {
			setSlug("");
			setSlugAvailable(null);
			setSlugManuallyEdited(false);
			return;
		}
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
			// Pure creation - only creates the entity
			const createdEntity = await props.createEntity(name(), slug());

			// Auto-invalidate router unless explicitly disabled
			if (props.autoInvalidate !== false) {
				await router.invalidate();
			}

			// Let parent handle post-creation actions
			if (props.onSuccess) {
				await props.onSuccess(createdEntity);
			}

			// Reset form after successful creation
			resetForm();
		} catch (error) {
			console.error(`Error creating ${props.entityName.toLowerCase()}:`, error);
			// Don't reset form on error - let user retry
		} finally {
			setIsSubmitting(false);
		}
	};

	createEffect(() => {
		if (name() && !slugManuallyEdited()) {
			const slug = generateSlugFromName(name());
			setSlug(slug);
			debouncedCheckSlugAvailability(slug);
		}
	});

	const entityLower = props.entityName.toLowerCase();
	const entityTitle = props.entityName;

	return (
		<div class="p-4">
			<form onSubmit={handleSubmit}>
				<div class="grid gap-6">
					<TextField class="gap-2">
						<TextFieldLabel>{entityTitle} Name</TextFieldLabel>
						<TextFieldInput
							name="name"
							value={name()}
							onInput={handleInputNameChange}
							type="text"
							placeholder={`My ${entityTitle}`}
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
							placeholder={`my-${entityLower}`}
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
						Create {entityTitle}
					</Button>
				</div>
			</form>
		</div>
	);
}
