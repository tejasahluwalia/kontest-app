import server from "@client/lib/server-api";
import { createFileRoute, Navigate, redirect, useRouter } from "@tanstack/solid-router";
import { Show, For, createSignal } from "solid-js";
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


export default async function createOrganization(name: string, slug: string) {
    const { data, error, status } = await server.api.organizations.index.post({
      name,
      slug,
    });
    if (error) {
      throw error.value;
    }
    if (status !== 201) {
      throw new Error(`Failed to create organization: ${status}`);
    }
    return data;
  }
  
  async function getSlugAvailability(slug: string) {
    const { data, error, status } = await server.api.organizations.checkAvailability({slug}).get();
    if (error) {
      throw error.value;
    }
    if (status !== 200) {
      throw new Error(`Failed to check slug availability: ${status}`);
    }
    return data.isAvailable;
  }
  
  function CreateOrganizationForm() {
    const [name, setName] = createSignal("");
    const [slug, setSlug] = createSignal("");
    const [slugAvailable, setSlugAvailable] = createSignal<boolean | null>(null);
    const [checkingSlug, setCheckingSlug] = createSignal(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = createSignal(false);
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const router = useRouter()
    
    // Create a debounced version of the slug availability check
    const debouncedCheckSlugAvailability = debounce((slug: string) => {
      checkSlugAvailability(slug);
    }, 500); // 500ms debounce time
  
    const handleInputNameChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
      const target = event.target as HTMLInputElement;
      setName(target.value);
      if (target.value === '') {
        setSlugAvailable(null);
        setSlugManuallyEdited(false);
      }
    }
  
    const handleInputSlugChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
      const target = event.target as HTMLInputElement;
      setSlug(target.value);
      setSlugManuallyEdited(true);
      debouncedCheckSlugAvailability(target.value);
    }
  
    const generateSlugFromName = async (name: string) => {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(slug);
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
        await createOrganization(name(), slug());
      } finally {
        setIsSubmitting(false);
        router.invalidate();
        resetForm();
      }
    };
  
    createEffect(() => {
      if (name() && !slugManuallyEdited()) {
        generateSlugFromName(name());
        debouncedCheckSlugAvailability(slug());
      }
    });
  
    return (
      <div class="border rounded-lg p-6 hover:shadow-md transition-shadow border-dashed">
        <form onSubmit={handleSubmit}>
          <div class="grid gap-4">
            <TextField class="gap-1">
              <TextFieldLabel>Organization Name</TextFieldLabel>
              <TextFieldInput
                name="name"
                value={name()}
                onInput={handleInputNameChange}
                type="text"
                placeholder="My Organization"
                required
              />
            </TextField>
            
            <TextField class="gap-1">
              <TextFieldLabel>Organization Slug</TextFieldLabel>
              <TextFieldInput
                name="slug"
                value={slug()}
                onInput={handleInputSlugChange}
                type="text"
                placeholder="my-organization"
                required
              />
              <div class="mt-1 text-sm">
                {checkingSlug() && <span class="text-gray-500">Checking availability...</span>}
                {!checkingSlug() && slugAvailable() === true && <span class="text-green-600">Slug is available</span>}
                {!checkingSlug() && slugAvailable() === false && <span class="text-red-600">Slug is not available</span>}
              </div>
            </TextField>
            
            <Button 
              type="submit" 
              disabled={isSubmitting() || !name() || !slug() || slugAvailable() === false}
            >
              {isSubmitting() && <IconLoader class="mr-2 size-4 animate-spin" />}
              Create Organization
            </Button>
          </div>
        </form>
      </div>
    );
  }
  