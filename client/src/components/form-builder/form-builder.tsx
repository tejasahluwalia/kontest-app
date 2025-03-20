import { FormBuilderProvider, useFormBuilder } from "./form-builder-context";
import { FormBuilderCanvas } from "./form-builder-canvas";
import { FormBuilderToolbox } from "./form-builder-toolbox";
import { FieldPropertiesPanel } from "./field-properties-panel";
import type { FormSchema } from "./primitives/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FormSettings } from "./form-settings";
import { Button } from "~/components/ui/button";
import { createEffect, onMount } from "solid-js";
import { FormFlowCanvas } from "./form-flow-editor/form-flow-canvas";

interface FormBuilderProps {
  initialSchema: FormSchema;
  onSave?: (schema: FormSchema) => void;
}

function FormBuilderContent(props: { onSave?: (schema: FormSchema) => void }) {
  const { formSchema } = useFormBuilder();

  return (
    <div class="space-y-6">
      <Tabs defaultValue="flow" class="w-full">
        <TabsList class="w-full max-w-md mx-auto">
          <TabsTrigger value="flow" class="flex-1">Form Flow</TabsTrigger>
          <TabsTrigger value="builder" class="flex-1">Form Builder</TabsTrigger>
          <TabsTrigger value="settings" class="flex-1">Form Settings</TabsTrigger>
          <TabsTrigger value="preview" class="flex-1">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flow" class="pt-6">
          <div class="grid">
            <FormFlowCanvas />
          </div>
        </TabsContent>
        
        <TabsContent value="builder" class="pt-6">
          <div class="grid">
            <FormBuilderCanvas />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" class="pt-6">
          <FormSettings />
        </TabsContent>
        
        <TabsContent value="preview" class="pt-6">
          <div class="border rounded-lg p-6">
            <p class="text-center text-muted-foreground">
              Form preview will be implemented in a future update
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {props.onSave && (
        <div class="flex justify-end mt-8">
          <Button onClick={() => props.onSave?.(formSchema)}>
            Save Form
          </Button>
        </div>
      )}
    </div>
  );
}

export function FormBuilder(props: FormBuilderProps) {
  return (
    <FormBuilderProvider initialSchema={props.initialSchema}>
      <FormBuilderContent onSave={props.onSave} />
    </FormBuilderProvider>
  );
}
