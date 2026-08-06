import { createContext } from "solid-js";
import type { fetchMemberProfiles } from "~/lib/queries";

type MemberProfilesContextType = Awaited<
	ReturnType<typeof fetchMemberProfiles>
>;

const MemberProfilesContext = createContext<MemberProfilesContextType>();

export default MemberProfilesContext;
