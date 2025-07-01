import { nanoid } from "nanoid";
import type { Block } from "./blocks";

export interface Step {
	id: string;
	label: string;
	nextButtonLabel?: string;
	previousButtonLabel?: string;
	showProgressBar?: boolean;
	validate?: () => boolean;
}

export type Steps = Step[];

export const createStep = (): Step => ({
	id: nanoid(),
	label: "New Step",
	nextButtonLabel: "Next",
	previousButtonLabel: "Previous",
	showProgressBar: true,
	validate: () => true,
});
