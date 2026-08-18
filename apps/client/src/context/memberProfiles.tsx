import { createContext } from "solid-js";
import type { fetchMemberProfiles } from "~/lib/queries";

export type MemberProfilesContextType = Awaited<
	ReturnType<typeof fetchMemberProfiles>
>;

const MemberProfilesContext = createContext<MemberProfilesContextType | any>();

export default MemberProfilesContext;
