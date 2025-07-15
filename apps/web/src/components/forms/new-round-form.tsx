import type * as schema from "database/schema";
import server from "~/lib/server-api";
import { createDefaultFormSchema } from "../form-builder/primitives/form";
import EntityForm from "./entity-form";

interface NewRoundFormProps {
	orgId: string;
	callId: string;
	onSuccess: () => void;
}

type RoundData = typeof schema.round.$inferSelect;

export default function NewRoundForm(props: NewRoundFormProps) {
	const { orgId, callId, onSuccess } = props;

	async function createRound(name: string, slug: string): Promise<RoundData> {
		const { data, error } = await server.api.host
			.orgs({ orgId })
			.calls({ callId })
			.rounds.post({
				name,
				slug,
				formSchema: createDefaultFormSchema(),
			});
		if (error) {
			throw error.value;
		}
		return data[0];
	}

	async function getSlugAvailability(slug: string): Promise<boolean> {
		const { data, error, status } = await server.api.host
			.orgs({ orgId })
			.calls({ callId })
			.rounds.checkAvailability({ slug })
			.get();
		if (error) {
			throw error.value;
		}
		if (status !== 200) {
			throw new Error(`Failed to check slug availability: ${status}`);
		}
		return data.isAvailable;
	}

	return (
		<EntityForm<RoundData>
			entityName="Round"
			createEntity={createRound}
			checkSlugAvailability={getSlugAvailability}
			onSuccess={onSuccess}
		/>
	);
}
