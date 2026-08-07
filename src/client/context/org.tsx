import { createContext } from "solid-js";
import type { MemberProfilesContextType } from "./memberProfiles";

export type OrgContextType = MemberProfilesContextType[number]["org"];

const OrgContext = createContext<OrgContextType | any>();

export default OrgContext;
