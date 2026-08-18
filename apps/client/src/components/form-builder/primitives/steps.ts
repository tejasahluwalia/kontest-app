import { nanoid } from "nanoid";

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
	id: `step_${nanoid()}`,
	label: "New Step",
	nextButtonLabel: "Next",
	previousButtonLabel: "Previous",
	showProgressBar: true,
	validate: () => true,
});
