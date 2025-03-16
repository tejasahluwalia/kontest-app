import { For } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { FieldType } from "./types";

interface FieldTypeOption {
  type: FieldType;
  label: string;
  icon: string;
}

const fieldTypes: FieldTypeOption[] = [
  { type: "text", label: "Text", icon: "text" },
  { type: "textarea", label: "Paragraph", icon: "paragraph" },
  { type: "number", label: "Number", icon: "number" },
  { type: "select", label: "Dropdown", icon: "dropdown" },
  { type: "multiselect", label: "Multi Select", icon: "multiselect" },
  { type: "checkbox", label: "Checkboxes", icon: "checkbox" },
  { type: "radio", label: "Radio", icon: "radio" },
  { type: "date", label: "Date", icon: "date" },
  { type: "file", label: "File Upload", icon: "file" },
  { type: "section", label: "Section Header", icon: "section" },
  { type: "group", label: "Group", icon: "group" },
];

export function FormBuilderToolbox() {
  const { activeSection, addField } = useFormBuilder();

  const handleAddField = (type: FieldType) => {
    if (activeSection()) {
      addField(activeSection()!, type);
    } else {
      // Show a notification that a section must be selected
      console.warn("Please select a section first");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-2">
          <For each={fieldTypes}>
            {(fieldType) => (
              <Button
                variant="outline"
                class="flex flex-col items-center justify-center h-20 p-2"
                onClick={() => handleAddField(fieldType.type)}
                disabled={!activeSection()}
              >
                <div class="text-lg mb-1">
                  {getFieldIcon(fieldType.icon)}
                </div>
                <span class="text-xs">{fieldType.label}</span>
              </Button>
            )}
          </For>
        </div>
      </CardContent>
    </Card>
  );
}

function getFieldIcon(icon: string) {
  switch (icon) {
    case "text":
      return "Aa";
    case "paragraph":
      return "¶";
    case "number":
      return "123";
    case "dropdown":
      return "▼";
    case "multiselect":
      return "▼▼";
    case "checkbox":
      return "☑";
    case "radio":
      return "◉";
    case "date":
      return "📅";
    case "file":
      return "📎";
    case "section":
      return "§";
    case "group":
      return "⧉";
    default:
      return "?";
  }
}
