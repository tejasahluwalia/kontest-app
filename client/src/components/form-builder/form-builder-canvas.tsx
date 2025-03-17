import { For, Show, createSignal } from "solid-js";
import { useFormBuilder } from "./form-builder-context";
// import { NodeRenderer } from "./node-components/node-renderer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";

export function FormBuilderCanvas() {
  const { 
    formSchema, 
    selectedStepId,
    setSelectedStepId,
    selectedBlockId,
    setSelectedBlockId,
    selectedChildId,
    setSelectedChildId,
    addBlockToStep
  } = useFormBuilder();

  return (  
    <div class="space-y-6">
      <For each={formSchema.graph[selectedStepId()].step.blocks}>
        {(block) => {
          const [isEditingTitle, setIsEditingTitle] = createSignal(false);
          const [isEditingDescription, setIsEditingDescription] = createSignal(false);
          
          const isActive = () => selectedBlockId() === block.id;
          
          return (
            <Card 
              class={`transition-all ${isActive() ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedBlockId(block.id)}
            >
              {/* <CardHeader class="relative">
                <Show
                  when={!isEditingTitle()}
                  fallback={
                    <Input
                      value={block.label}
                      onInput={(e: Event) => updateBlock(block.id, { label: (e.target as HTMLInputElement).value })}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e: KeyboardEvent) => e.key === "Enter" && setIsEditingTitle(false)}
                      autofocus
                    />
                  }
                >
                  <CardTitle 
                    class="cursor-pointer hover:text-primary"
                    onClick={() => isActive() && setIsEditingTitle(true)}
                  >
                    {node.label}
                  </CardTitle>
                </Show>
                
                <Show
                  when={!isEditingDescription()}
                  fallback={
                    <TextField>
                      <TextFieldTextArea
                        value={node.description || ""}
                        onInput={(e: Event) => updateNode(node.id, { description: (e.target as HTMLTextAreaElement).value })}
                        onBlur={() => setIsEditingDescription(false)}
                        rows={3}
                        autofocus
                      />
                    </TextField>
                  }
                >
                  <Show when={node.description}>
                    <CardDescription 
                      class="cursor-pointer hover:text-primary"
                      onClick={() => isActive() && setIsEditingDescription(true)}
                    >
                      {node.description}
                    </CardDescription>
                  </Show>
                  <Show when={!node.description && isActive()}>
                    <button 
                      class="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      + Add description
                    </button>
                  </Show>
                </Show>
                
                <Show when={isActive()}>
                  <div class="absolute right-6 top-6 flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          addFieldNode("text", node.id);
                        }}
                      >
                        Add Field
                      </Button>
                    </div>
                  </div>
                </Show>
              </CardHeader>
              
              <CardContent>
                <Show when={'children' in node && node.children.length > 0} fallback={
                  <div class="py-8 flex flex-col items-center justify-center border border-dashed rounded-md">
                    <p class="text-muted-foreground mb-4">No fields added to this node yet</p>
                    <Button 
                      variant="outline"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        addFieldNode("text", node.id);
                      }}
                    >
                      Add your first field
                    </Button>
                  </div>
                }>
                  <div class="space-y-4">
                    <For each={'children' in node ? node.children : []}>
                      {(childNode) => (
                        <NodeRenderer node={childNode} parentId={node.id} />
                      )}
                    </For>
                  </div>
                </Show>
              </CardContent> */}
            </Card>
          );
        }}
      </For>
      
      <div class="flex justify-center">
        <Button 
          variant="outline" 
          // onClick={() => addBlockToStep()}
          class="w-full max-w-md"
        >
          Add Step
        </Button>
      </div>
    </div>
  );
}
