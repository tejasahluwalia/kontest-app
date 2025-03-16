import { For, Show, createSignal } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
import { FieldRenderer } from "./field-components/field-renderer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { TextField, TextFieldTextArea, TextFieldInput } from "~/components/ui/text-field";

export function FormBuilderCanvas() {
  const { 
    formSchema, 
    activeSection, 
    setActiveSection, 
    addSection, 
    updateSection,
    addField
  } = useFormBuilder();

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div class="space-y-6">
      <For each={formSchema.sections}>
        {(section) => {
          const [isEditingTitle, setIsEditingTitle] = createSignal(false);
          const [isEditingDescription, setIsEditingDescription] = createSignal(false);
          
          const isActive = () => activeSection() === section.id;
          
          return (
            <Card 
              class={`transition-all ${isActive() ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleSectionClick(section.id)}
            >
              <CardHeader class="relative">
                <Show
                  when={!isEditingTitle()}
                  fallback={
                    <Input
                      value={section.title}
                      onInput={(e) => updateSection(section.id, { title: e.currentTarget.value })}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                      autofocus
                    />
                  }
                >
                  <CardTitle 
                    class="cursor-pointer hover:text-primary"
                    onClick={() => isActive() && setIsEditingTitle(true)}
                  >
                    {section.title}
                  </CardTitle>
                </Show>
                
                <Show
                  when={!isEditingDescription()}
                  fallback={
                    <TextField>
                      <TextFieldTextArea
                        value={section.description || ""}
                        onInput={(e) => updateSection(section.id, { description: e.currentTarget.value })}
                        onBlur={() => setIsEditingDescription(false)}
                        rows={3}
                        autofocus
                      />
                    </TextField>
                  }
                >
                  <Show when={section.description}>
                    <CardDescription 
                      class="cursor-pointer hover:text-primary"
                      onClick={() => isActive() && setIsEditingDescription(true)}
                    >
                      {section.description}
                    </CardDescription>
                  </Show>
                  <Show when={!section.description && isActive()}>
                    <button 
                      class="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      + Add section description
                    </button>
                  </Show>
                </Show>
                
                <Show when={isActive()}>
                  <div class="absolute right-6 top-6 flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          addField(section.id, "text");
                        }}
                      >
                        Add Field
                      </Button>
                    </div>
                  </div>
                </Show>
              </CardHeader>
              
              <CardContent>
                <Show when={section.fields.length > 0} fallback={
                  <div class="py-8 flex flex-col items-center justify-center border border-dashed rounded-md">
                    <p class="text-muted-foreground mb-4">No fields added to this section yet</p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        addField(section.id, "text");
                      }}
                    >
                      Add your first field
                    </Button>
                  </div>
                }>
                  <div class="space-y-4">
                    <For each={section.fields}>
                      {(field) => (
                        <FieldRenderer field={field} sectionId={section.id} />
                      )}
                    </For>
                  </div>
                </Show>
              </CardContent>
            </Card>
          );
        }}
      </For>
      
      <div class="flex justify-center">
        <Button 
          variant="outline" 
          onClick={addSection}
          class="w-full max-w-md"
        >
          Add Section
        </Button>
      </div>
    </div>
  );
}
