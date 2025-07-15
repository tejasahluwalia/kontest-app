import { notFound } from "@tanstack/solid-router";
import { Show, useContext } from "solid-js";
import { FormBuilder } from "~/components/form-builder";
import type { FormSchema } from "~/components/form-builder/primitives/form";
import RoundContext from "~/context/round";

export const Route = createFileRoute({
	component: RouteComponent,
	loader: async ({ context: { org, call } }) => {
		return { call, org };
	},
});

function RouteComponent() {
	const round = useContext(RoundContext);

	if (!round || !round.formSchema) {
		throw notFound();
	}

	const initialSchema = round.formSchema as FormSchema;

	return (
		<Show when={initialSchema}>
			<FormBuilder initialSchema={initialSchema} />
		</Show>
	);
}
