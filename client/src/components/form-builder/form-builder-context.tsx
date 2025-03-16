import { createContext, createSignal, useContext, type Accessor, type Component, type ParentComponent } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { FormSchema, FormField, FormSection, FieldType } from "./types";
import { createId } from "@paralleldrive/cuid2";

interface FormBuilderContextType {
  formSchema: FormSchema;
  activeFieldId: Accessor<string | null>;
  activeSection: Accessor<string | null>;
  setActiveFieldId: (id: string | null) => void;
  setActiveSection: (id: string | null) => void;
  addSection: () => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, data: Partial<FormSection>) => void;
  addField: (sectionId: string, type: FieldType) => void;
  removeField: (sectionId: string, fieldId: string) => void;
  updateField: (sectionId: string, fieldId: string, data: Partial<FormField>) => void;
  moveField: (sectionId: string, fromIndex: number, toIndex: number) => void;
  updateFormSettings: (data: Partial<Omit<FormSchema, 'sections'>>) => void;
}

const defaultFormSchema: FormSchema = {
  id: createId(),
  name: "New Contest Form",
  description: "Please fill out the form to apply for this contest.",
  rules: "",
  eligibility: "",
  sections: [
    {
      id: createId(),
      title: "Basic Information",
      description: "Please provide your basic information",
      fields: [],
    },
  ],
};

const FormBuilderContext = createContext<FormBuilderContextType>();

export const FormBuilderProvider: ParentComponent<{ initialSchema?: FormSchema }> = (props) => {
  const [formSchema, setFormSchema] = createStore<FormSchema>(
    props.initialSchema || defaultFormSchema
  );
  const [activeFieldId, setActiveFieldId] = createSignal<string | null>(null);
  const [activeSection, setActiveSection] = createSignal<string | null>(null);

  const addSection = () => {
    const newSection: FormSection = {
      id: createId(),
      title: "New Section",
      description: "",
      fields: [],
    };

    setFormSchema(
      produce((draft) => {
        draft.sections.push(newSection);
      })
    );

    setActiveSection(newSection.id);
  };

  const removeSection = (sectionId: string) => {
    setFormSchema(
      produce((draft) => {
        const index = draft.sections.findIndex((s) => s.id === sectionId);
        if (index !== -1) {
          draft.sections.splice(index, 1);
        }
      })
    );

    if (activeSection() === sectionId) {
      setActiveSection(null);
    }
  };

  const updateSection = (sectionId: string, data: Partial<FormSection>) => {
    setFormSchema(
      produce((draft) => {
        const section = draft.sections.find((s) => s.id === sectionId);
        if (section) {
          Object.assign(section, data);
        }
      })
    );
  };

  const addField = (sectionId: string, type: FieldType) => {
    const newField: FormField = {
      id: createId(),
      type,
      label: `New ${type} field`,
      name: `field_${createId().slice(0, 8)}`,
      placeholder: "",
      helpText: "",
      required: false,
    };

    // Add options for select, multiselect, radio, checkbox
    if (["select", "multiselect", "radio", "checkbox"].includes(type)) {
      newField.options = [
        { id: createId(), label: "Option 1", value: "option_1" },
        { id: createId(), label: "Option 2", value: "option_2" },
      ];
    }

    setFormSchema(
      produce((draft) => {
        const section = draft.sections.find((s) => s.id === sectionId);
        if (section) {
          section.fields.push(newField);
        }
      })
    );

    setActiveFieldId(newField.id);
  };

  const removeField = (sectionId: string, fieldId: string) => {
    setFormSchema(
      produce((draft) => {
        const section = draft.sections.find((s) => s.id === sectionId);
        if (section) {
          const index = section.fields.findIndex((f) => f.id === fieldId);
          if (index !== -1) {
            section.fields.splice(index, 1);
          }
        }
      })
    );

    if (activeFieldId() === fieldId) {
      setActiveFieldId(null);
    }
  };

  const updateField = (sectionId: string, fieldId: string, data: Partial<FormField>) => {
    setFormSchema(
      produce((draft) => {
        const section = draft.sections.find((s) => s.id === sectionId);
        if (section) {
          const field = section.fields.find((f) => f.id === fieldId);
          if (field) {
            Object.assign(field, data);
          }
        }
      })
    );
  };

  const moveField = (sectionId: string, fromIndex: number, toIndex: number) => {
    setFormSchema(
      produce((draft) => {
        const section = draft.sections.find((s) => s.id === sectionId);
        if (section && fromIndex !== toIndex) {
          const [movedField] = section.fields.splice(fromIndex, 1);
          section.fields.splice(toIndex, 0, movedField);
        }
      })
    );
  };

  const updateFormSettings = (data: Partial<Omit<FormSchema, 'sections'>>) => {
    setFormSchema(
      produce((draft) => {
        Object.assign(draft, data);
      })
    );
  };

  return (
    <FormBuilderContext.Provider
      value={{
        formSchema,
        activeFieldId,
        activeSection,
        setActiveFieldId,
        setActiveSection,
        addSection,
        removeSection,
        updateSection,
        addField,
        removeField,
        updateField,
        moveField,
        updateFormSettings,
      }}
    >
      {props.children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
}
