import { notFound } from "@tanstack/solid-router";
import { FormBuilder } from "~/components/form-builder";
import type { FormSchema } from "~/components/form-builder/primitives/form";

export const Route = createFileRoute({
	component: RouteComponent,
	loader: async ({ context: { org, call } }) => {
		if (!call.schema) {
			throw notFound();
		}
		return { call, org };
	},
});

function RouteComponent() {
	const { call } = Route.useLoaderData()();
	const initialSchema = call.schema as FormSchema;

	return <FormBuilder initialSchema={initialSchema} />;
}
