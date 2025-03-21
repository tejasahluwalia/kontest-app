import { Match, Switch } from "solid-js";
import type { 
  InputField, 
  TextField as TextFieldType, 
  RichTextField as RichTextFieldType,
  SelectField as SelectFieldType,
  CheckboxField as CheckboxFieldType,
  RadioField as RadioFieldType
} from "../../primitives/fields";
import { TextField } from "./text-field";
import { TextAreaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { CheckboxField } from "./checkbox-field";
import { RadioField } from "./radio-field";

interface FieldRendererProps {
  child: InputField;
  blockId: string;
  stepId: string;
  formData?: Record<string, any>;
  updateFormData?: (data: Record<string, any>) => void;
}

export function FieldRenderer(props: FieldRendererProps) {
  return (
    <Switch>
      <Match when={props.child.fieldType === "text"}>
        <TextField 
          child={props.child as TextFieldType} 
          blockId={props.blockId} 
          stepId={props.stepId} 
          formData={props.formData} 
          updateFormData={props.updateFormData} 
        />
      </Match>
      <Match when={props.child.fieldType === "rich-text"}>
        <TextAreaField 
          child={props.child as RichTextFieldType} 
          blockId={props.blockId} 
          stepId={props.stepId} 
          formData={props.formData} 
          updateFormData={props.updateFormData} 
        />
      </Match>
      <Match when={props.child.fieldType === "select"}>
        <SelectField 
          child={props.child as SelectFieldType} 
          blockId={props.blockId} 
          stepId={props.stepId} 
          formData={props.formData} 
          updateFormData={props.updateFormData} 
        />
      </Match>
      <Match when={props.child.fieldType === "checkbox"}>
        <CheckboxField 
          child={props.child as CheckboxFieldType} 
          blockId={props.blockId} 
          stepId={props.stepId} 
          formData={props.formData} 
          updateFormData={props.updateFormData} 
        />
      </Match>
      <Match when={props.child.fieldType === "radio"}>
        <RadioField 
          child={props.child as RadioFieldType} 
          blockId={props.blockId} 
          stepId={props.stepId} 
          formData={props.formData} 
          updateFormData={props.updateFormData} 
        />
      </Match>
      <Match when={true}>
        <div class="p-4 border border-dashed rounded-md">
          <p class="text-muted-foreground">Field type "{props.child.fieldType}" not implemented yet</p>
        </div>
      </Match>
    </Switch>
  );
}
