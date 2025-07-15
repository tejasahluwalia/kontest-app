import { queryOptions } from "@tanstack/solid-query";
import server from "./server-api";

export const fetchMemberProfiles = async () => {
	const { data, error, status } = await server.api.host.get();
	if (error) {
		console.log(error);
		throw new Error(`Failed to fetch organizations: ${status}`);
	}
	return data;
};

export const memberProfilesQueryOptions = () =>
	queryOptions({
		queryFn: fetchMemberProfiles,
		queryKey: ["memberProfiles"],
	});

export const fetchOrg = async (orgSlug: string) => {
	const { data, error, status } = await server.api.host.orgs({ orgSlug }).get();
	if (error) {
		console.log(error);
		throw new Error(`Failed to fetch organizations: ${status}`);
	}
	return data;
};
