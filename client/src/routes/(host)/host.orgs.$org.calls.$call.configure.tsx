import server from "@client/lib/server-api";
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

	return (
		<div class="container py-6 max-w-7xl">
			<div class="flex justify-between items-center mb-6">
				<h1 class="text-2xl font-bold">Configure {call.name} Form</h1>
			</div>

			<div>
				<FormBuilder initialSchema={initialSchema} />
			</div>
		</div>
	);
}
