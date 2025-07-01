import { nanoid } from "nanoid";
import type { Display, InputField } from "./fields";

type Child = InputField | Display;

// List type definition
type Children = Child[];

const createChild = (): Child => {
	const id = nanoid();
	return {
		childType: "field",
		id: id,
		fieldType: "text",
		label: "New Field",
		name: `new_field_${id}`,
		required: false,
		description: "",
	};
};

// Create an empty list
const createChildren = (): Children => [createChild()];

export { type Child, type Children, createChild, createChildren };
