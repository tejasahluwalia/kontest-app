import { useRouter } from "@tanstack/solid-router";
import server from "~/lib/server-api";
import EntityForm from "./entity-form";

interface OrgData {
	id: string;
	name: string;
	slug: string;
}

export default function NewOrgForm() {
	async function createOrg(name: string, slug: string): Promise<OrgData> {
		const { data, error } = await server.api.host.orgs.post({
			name,
			slug,
		});
		if (error) {
			throw error.value;
		}
		return data[0];
	}

	async function getSlugAvailability(slug: string): Promise<boolean> {
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

	const router = useRouter();

	async function onSuccess(data: OrgData) {
		await router.navigate({
			to: "/host/orgs/$orgSlug",
			params: { orgSlug: data.slug },
		});
	}

	return (
		<EntityForm<OrgData>
			entityName="Org"
			createEntity={createOrg}
			checkSlugAvailability={getSlugAvailability}
			onSuccess={onSuccess}
		/>
	);
}
