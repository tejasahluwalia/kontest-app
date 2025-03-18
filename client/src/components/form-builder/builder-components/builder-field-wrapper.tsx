import { For, Show, batch, createSignal, type ParentComponent } from "solid-js";
import { useFormBuilder } from "../form-builder-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@client/components/ui/collapsible";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { Switch } from "@client/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@client/components/ui/tabs";
import { createId } from "@paralleldrive/cuid2";
import type { FieldOption, InputField } from "../primitives/fields";

interface BuilderFieldWrapperProps {
  childId: string;
  blockId: string;
  stepId: string;
  label: string;
  helpText?: string;
  required?: boolean;
  fieldType: string;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: { id: string; label: string; value: string }[];
  allowOther?: boolean;
  multiple?: boolean;
}

export const BuilderFieldWrapper: ParentComponent<BuilderFieldWrapperProps> = (props) => {
  const { 
    selectedChildId, 
    setSelectedChildId, 
    setSelectedBlockId, 
    setSelectedStepId,
    updateChildInBlock,
    removeChildFromBlock,
    selectedChild
  } = useFormBuilder();
  
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("general");
  
  const isActive = () => selectedChild()?.id === props.childId;
  
  const handleClick = () => {
    batch(() => {
      setSelectedStepId(props.stepId);
      setSelectedBlockId(props.blockId);
      setSelectedChildId(props.childId);
    });
  };
  
  const handleUpdateField = (data: Partial<InputField>) => {
    updateChildInBlock(props.childId, props.blockId, data);
  };
  
  const handleAddOption = () => {
    if (!props.options) return;
    
    const newOption: FieldOption = {
      id: createId(),
      label: `Option ${(props.options?.length || 0) + 1}`,
      value: `option_${(props.options?.length || 0) + 1}`,
    };
    
    const updatedOptions = [...(props.options || []), newOption];
    handleUpdateField({ options: updatedOptions });
  };
  
  const handleUpdateOption = (optionId: string, data: Partial<FieldOption>) => {
    if (!props.options) return;
    
    const updatedOptions = props.options.map(option => 
      option.id === optionId ? { ...option, ...data } : option
    );
    
    handleUpdateField({ options: updatedOptions });
  };
  
  const handleRemoveOption = (optionId: string) => {
    if (!props.options) return;
    
    const updatedOptions = props.options.filter(option => option.id !== optionId);
    handleUpdateField({ options: updatedOptions });
  };
  
  const handleDeleteField = () => {
    removeChildFromBlock(props.childId, props.blockId);
  };

  return (
    <div 
      class={`relative border rounded-md p-4 mb-3 transition-all border-border hover:border-muted-foreground`}
      onClick={handleClick}
    >
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xs bg-muted px-2 py-1 rounded text-muted-foreground uppercase">{props.fieldType}</span>
          <span class="font-medium">{props.label}</span>
          <Show when={props.required}>
            <span class="text-destructive">*</span>
          </Show>
        </div>
        
        <div class="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            class={`transition-opacity hover:opacity-100 opacity-0 pointer-events-none"}`}
            onClick={() => {
              removeChildFromBlock(props.childId, props.blockId);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </Button>
        </div>
      </div>
      
      <Show when={props.helpText}>
        <p class="text-sm text-muted-foreground mb-2">{props.helpText}</p>
      </Show>
      
      <div class="mt-2 space-y-2">
        {props.children}
        
        <Collapsible open={isOpen()} onOpenChange={setIsOpen}>
          <CollapsibleTrigger class="flex w-full items-center justify-between p-2 rounded-md hover:bg-muted transition-colors">
            <span class="text-sm font-medium">Field Properties</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              class={`transform transition-transform ${isOpen() ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent class="px-3 pt-2 pb-3 border-t mt-2">
            <Tabs value={activeTab()} onChange={setActiveTab}>              
              <TabsList class="w-full mb-4">
                <TabsTrigger value="general" class="flex-1">General</TabsTrigger>
                <TabsTrigger value="validation" class="flex-1">Validation</TabsTrigger>
                <Show when={["select", "checkbox", "radio"].includes(props.fieldType.toLowerCase())}>
                  <TabsTrigger value="options" class="flex-1">Options</TabsTrigger>
                </Show>
                <TabsTrigger value="conditional" class="flex-1">Conditional</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" class="space-y-4">
                <div>
                  <Label for="field-label">Label</Label>
                  <Input
                    id="field-label"
                    value={props.label}
                    onInput={(e) => handleUpdateField({ label: e.currentTarget.value })}
                  />
                </div>
                
                <div>
                  <Label for="field-name">Field Name</Label>
                  <Input
                    id="field-name"
                    value={props.childId}
                    disabled
                  />
                  <p class="text-xs text-muted-foreground mt-1">
                    Field identifier in form submissions
                  </p>
                </div>
                
                <div>
                  <Label for="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={props.placeholder || ""}
                    onInput={(e) => handleUpdateField({ placeholder: e.currentTarget.value })}
                  />
                </div>
                
                <div>
                  <Label for="field-help-text">Help Text</Label>
                  <Input
                    id="field-help-text"
                    value={props.helpText || ""}
                    onInput={(e) => handleUpdateField({ helpText: e.currentTarget.value })}
                  />
                </div>
                
                <div>
                  <Label for="field-description">Description</Label>
                  <Input
                    id="field-description"
                    value={props.description || ""}
                    onInput={(e) => handleUpdateField({ description: e.currentTarget.value })}
                  />
                </div>
                
                <Show when={props.defaultValue !== undefined}>
                  <div>
                    <Label for="field-default-value">Default Value</Label>
                    <Input
                      id="field-default-value"
                      value={typeof props.defaultValue === 'object' ? JSON.stringify(props.defaultValue) : String(props.defaultValue || "")}
                      onInput={(e) => handleUpdateField({ defaultValue: e.currentTarget.value })}
                    />
                  </div>
                </Show>
              </TabsContent>

              {/* Validation Tab */}
              <TabsContent value="validation" class="space-y-4">
                <div class="flex items-center justify-between">
                  <Label for="field-required">Required</Label>
                  <Switch
                    id="field-required"
                    checked={props.required || false}
                    onChange={(isChecked) => handleUpdateField({ required: isChecked })}
                  />
                </div>
                
                <Show when={["text", "rich-text"].includes(props.fieldType.toLowerCase())}>
                  <div>
                    <Label for="field-min-length">Minimum Length</Label>
                    <Input
                      id="field-min-length"
                      type="number"
                      value={props.minLength || ""}
                      onInput={(e) => {
                        const minLength = e.currentTarget.value ? Number(e.currentTarget.value) : undefined;
                        handleUpdateField({ minLength });
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label for="field-max-length">Maximum Length</Label>
                    <Input
                      id="field-max-length"
                      type="number"
                      value={props.maxLength || ""}
                      onInput={(e) => {
                        const maxLength = e.currentTarget.value ? Number(e.currentTarget.value) : undefined;
                        handleUpdateField({ maxLength });
                      }}
                    />
                  </div>
                </Show>
                
                <Show when={props.fieldType.toLowerCase() === "number"}>
                  <div>
                    <Label for="field-min">Minimum Value</Label>
                    <Input
                      id="field-min"
                      type="number"
                      value={props.min || ""}
                      onInput={(e) => {
                        const min = e.currentTarget.value ? Number(e.currentTarget.value) : undefined;
                        handleUpdateField({ min });
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label for="field-max">Maximum Value</Label>
                    <Input
                      id="field-max"
                      type="number"
                      value={props.max || ""}
                      onInput={(e) => {
                        const max = e.currentTarget.value ? Number(e.currentTarget.value) : undefined;
                        handleUpdateField({ max });
                      }}
                    />
                  </div>
                </Show>
              </TabsContent>

              {/* Options Tab */}
              <TabsContent value="options" class="space-y-4">
                <Show when={["select", "checkbox", "radio"].includes(props.fieldType.toLowerCase())}>
                  <div class="space-y-2">
                    <For each={props.options || []}>
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
                  </div>
                </Show>
              </TabsContent>

              {/* Conditional Tab */}
              <TabsContent value="conditional" class="space-y-4">
                <p class="text-muted-foreground">
                  Conditional logic allows you to show or hide this field based on other field values.
                  (Coming soon)
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
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
