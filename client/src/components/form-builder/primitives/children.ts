import type { Display, InputField } from "./fields";
import { nanoid } from "nanoid";

type Child = InputField | Display;

// List type definition
type Children = Child[];

const createChild = (): Child => ({
  childType: "field",
  id: nanoid(),
  fieldType: "text",
  label: "New Field",
  name: "new_field",
  required: false,
  placeholder: "Enter value",
  description: "",
  defaultValue: "",
});

// Create an empty list
const createChildren = (): Children => [createChild()];

export { type Child, type Children, createChild, createChildren };
