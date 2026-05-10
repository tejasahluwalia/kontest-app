import type * as schema from "database/schema";
import server from "~/lib/server-api";
import EntityForm from "./entity-form";

interface NewCallFormProps {
	orgId: string;
	onSuccess: () => void;
}

type CallData = typeof schema.call.$inferSelect;

export default function NewCallForm(props: NewCallFormProps) {
	const { orgId, onSuccess } = props;

	async function createCall(name: string, slug: string): Promise<CallData> {
		const { data, error } = await server.api.host.orgs({ orgId }).calls.post({
			name,
			slug,
		});
		if (error) {
			throw error.value;
		}
		return data[0];
	}

	async function getSlugAvailability(slug: string): Promise<boolean> {
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

	return (
		<EntityForm<CallData>
			entityName="Call"
			createEntity={createCall}
			checkSlugAvailability={getSlugAvailability}
			onSuccess={onSuccess}
		/>
	);
}
