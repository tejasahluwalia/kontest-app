import { For, Show, createEffect, createSignal } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { InputField, FieldOption } from "./primitives/fields";
import type { Child } from "./primitives/children";
import { createId } from "@paralleldrive/cuid2";

export function FieldPropertiesPanel() {
  const { selectedChildId, setSelectedChildId, formSchema, selectedStepId, selectedBlockId } = useFormBuilder();
  const [activeTab, setActiveTab] = createSignal("general");

  const child = () => formSchema.graph[selectedStepId()].step.blocks.find(block => block.id === selectedBlockId())?.children.find(child => child.id === selectedChildId())

  if (!child() ||child()?.childType !== 'field') return null;

  const activeField = () => {
    if (!child()) return null;
    return child();
  };

  const handleUpdateField = (data: Partial<InputField>) => {
    const field = activeField();
    if (field) {
      // updateNode(field.id, data);
      // setFormSchema(produce(draft => {
      //   const updatedField = updateNode(draft, field.id, data);
      //   draft.graph[selectedStepId()].step.blocks.find(block => block.id === selectedBlockId())?.children.find(child => child.id === selectedChildId()) = updatedField;
      // }));
      // saveToHistory();
    }
  };

  const handleAddOption = () => {
    const field = activeField();
    if (!field || field.childType !== 'field' || field.fieldType !== 'select') return;

    const newOption: FieldOption = {
      id: createId(),
      label: `Option ${(field.options?.length || 0) + 1}`,
      value: `option_${(field.options?.length || 0) + 1}`,
    };
    
    const updatedOptions = [...(field.options || []), newOption];
    handleUpdateField({ options: updatedOptions });
  };

  const handleUpdateOption = (optionId: string, data: Partial<FieldOption>) => {
    const field = activeField();
    if (!field || field.childType !== 'field' || field.fieldType !== 'select') return;
    
    const updatedOptions = field.options?.map(option => 
      option.id === optionId ? { ...option, ...data } : option
    );
    
    handleUpdateField({ options: updatedOptions });
  };

  const handleRemoveOption = (optionId: string) => {
    const field = activeField();
    if (!field || field.childType !== 'field' || field.fieldType !== 'select') return;
    
    const updatedOptions = field.options?.filter(option => option.id !== optionId);
    handleUpdateField({ options: updatedOptions });
  };

  const handleDeleteField = () => {
    if (activeField()) {
      // removeNode(field.id);
    }
  };

  return (
    <Show when={(() => {
      const field = activeField();
      return field && field.childType === 'field' ? field : undefined;
    })()} fallback={
      <Card>
        <CardHeader>
          <CardTitle>Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">Select a field to edit its properties</p>
        </CardContent>
      </Card> 
    }>{(field) => (<Card>
      <CardHeader>
        <CardTitle>Field Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab()} onChange={setActiveTab}>
          <TabsList class="w-full">
            <TabsTrigger value="general" class="flex-1">General</TabsTrigger>
            <TabsTrigger value="validation" class="flex-1">Validation</TabsTrigger>
            <Show when={["select", "multiselect", "checkbox", "radio"].includes(field().fieldType || "")}>
              <TabsTrigger value="options" class="flex-1">Options</TabsTrigger>
            </Show>
            <TabsTrigger value="conditional" class="flex-1">Conditional</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" class="space-y-4 pt-4">
            <div>
              <Label for="field-label">Label</Label>
              <Input
                id="field-label"
                value={field().label}
                onInput={(e) => handleUpdateField({ label: e.currentTarget.value })}
              />
            </div>
            
            <div>
              <Label for="field-name">Field Name</Label>
              <Input
                id="field-name"
                value={field().name}
                onInput={(e) => handleUpdateField({ name: e.currentTarget.value })}
              />
              <p class="text-xs text-muted-foreground mt-1">
                This is used as the field identifier in form submissions
              </p>
            </div>
            
            <div>
              <Label for="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={field().placeholder || ""}
                onInput={(e) => handleUpdateField({ placeholder: e.currentTarget.value })}
              />
            </div>
            
            <div>
              <Label for="field-help-text">Help Text</Label>
              <Input
                id="field-help-text"
                value={field().helpText || ""}
                onInput={(e) => handleUpdateField({ helpText: e.currentTarget.value })}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="validation" class="space-y-4 pt-4">
            <div class="flex items-center justify-between">
              <Label for="field-required">Required</Label>
              <Switch
                id="field-required"
                checked={field().required || false}
                onChange={(isChecked) => handleUpdateField({ required: isChecked })}
              />
            </div>
            
            <Show when={field().fieldType === "number"}>
              <div>
                <Label for="field-min">Minimum Value</Label>
                <Input
                  id="field-min"
                  type="number"
                  value={field().validation?.min || ""}
                  onInput={(e) => {
                    const min = e.currentTarget.value ? Number(e.currentTarget.value) : undefined;
                    handleUpdateField({ 
                      validation: { 
                        ...field().validation,
                        min 
                      } 
                    });
                  }}
                />
              </div>
              
              <div>
                <Label for="field-max">Maximum Value</Label>
                <Input
                  id="field-max"
                  type="number"
                  value={field().validation?.max || ""}
                  onInput={(e) => {
                    const max = e.currentTarget.value ? Number(e.currentTarget.value) : undefined;
                    handleUpdateField({ 
                      validation: { 
                        ...field().validation,
                        max 
                      } 
                    });
                  }}
                />
              </div>
            </Show>
            
            <Show when={["text", "textarea"].includes(field().fieldType || "")}>
              <div>
                <Label for="field-pattern">Pattern (Regex)</Label>
                <Input
                  id="field-pattern"
                  value={field().validation?.pattern || ""}
                  onInput={(e) => {
                    handleUpdateField({ 
                      validation: { 
                        ...field().validation,
                        pattern: e.currentTarget.value || undefined
                      } 
                    });
                  }}
                />
              </div>
            </Show>
            
            <div>
              <Label for="field-custom-message">Custom Error Message</Label>
              <Input
                id="field-custom-message"
                value={field().validation?.customMessage || ""}
                onInput={(e) => {
                  handleUpdateField({ 
                    validation: { 
                      ...field().validation,
                      customMessage: e.currentTarget.value || undefined
                    } 
                  });
                }}
              />
            </div>
          </TabsContent>
          
          {/* <TabsContent value="options" class="space-y-4 pt-4">
            <Show when={() => {
              const selectField = field();
              return selectField && selectField.fieldType === 'select' ? selectField : undefined;
            }}>
              {(selectField) => <div class="space-y-2">
                <For each={selectField() || []}>
                  {(option) => (
                    <div class="flex items-center gap-2">
                      <Input
                        value={option.label}
                        onInput={(e) => handleUpdateOption(option.id, { label: e.currentTarget.value })}
                        placeholder="Option label"
                      />
                      <Input
                        value={option.value}
                        onInput={(e) => handleUpdateOption(option.id, { value: e.currentTarget.value })}
                        placeholder="Option value"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveOption(option.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </Button>
                    </div>
                  )}
                </For>
                
                <Button 
                  variant="outline" 
                  class="w-full"
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </div>}
            </Show>
          </TabsContent> */}
          
          <TabsContent value="conditional" class="space-y-4 pt-4">
            <p class="text-muted-foreground">
              Conditional logic allows you to show or hide this field based on other field values.
              (Not implemented in this prototype)
            </p>
          </TabsContent>
        </Tabs>
        
        <div class="mt-6 pt-4 border-t">
          <Button 
            variant="destructive" 
            class="w-full"
            onClick={handleDeleteField}
          >
            Delete Field
          </Button>
        </div>
      </CardContent>
    </Card>)}
    </Show>
  );
}
