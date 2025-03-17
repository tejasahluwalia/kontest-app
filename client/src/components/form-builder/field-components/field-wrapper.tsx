import { Show, createSignal } from "solid-js";
import type { JSX, ParentComponent } from 'solid-js'
import { useFormBuilder } from "../form-builder-context";

interface FieldWrapperProps {
  childId: string;
  blockId: string;
  children: JSX.Element;
  label: string;
  helpText?: string;
  required?: boolean;
}

export const FieldWrapper: ParentComponent<FieldWrapperProps> = (props) => {
  const { selectedChildId, setSelectedChildId } = useFormBuilder();
  const [isHovered, setIsHovered] = createSignal(false);
  
  const isActive = () => selectedChildId() === props.childId;
  
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    setSelectedChildId(props.childId);
  };

  return (
    <div 
      class={`relative border rounded-md p-4 mb-3 transition-all ${
        isActive() ? "border-primary shadow-sm" : "border-border"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-1">
          <span class="font-medium">{props.label}</span>
          <Show when={props.required}>
            <span class="text-destructive">*</span>
          </Show>
        </div>
        
        <Show when={isActive() || isHovered()}>
          <div class="flex items-center gap-1">
            <button 
              type="button" 
              class="p-1 text-muted-foreground hover:text-foreground"
              title="Drag to reorder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        </Show>
      </div>
      
      <Show when={props.helpText}>
        <p class="text-sm text-muted-foreground mb-2">{props.helpText}</p>
      </Show>
      
      <div>
        {props.children}
      </div>
    </div>
  );
};
