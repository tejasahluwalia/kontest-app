import { createSignal, createMemo, createEffect, type Component, Show, For } from "solid-js";
import { Button } from "@client/components/ui/button";
import type { FormGraph, StepGraphNode } from "../primitives/form";
import { evaluateConditionalRule } from "../primitives/conditions";
import StepRenderer from "./renderers/step-renderer";
import ArrowRight from "lucide-solid/icons/arrow-right";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import CheckCircle from "lucide-solid/icons/check-circle";
import { createStore } from "solid-js/store";

interface FormNavigatorProps {
  graph: FormGraph;
  onSubmit?: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

const FormNavigator: Component<FormNavigatorProps> = (props) => {
  // State for form data and current step
  const [formData, setFormData] = createStore<Record<string, any>>(props.initialData || {});
  const [currentStepIndex, setCurrentStepIndex] = createSignal(0);
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  // Memoized values
  const currentStep = createMemo(() => props.graph[currentStepIndex()]);
  const isFirstStep = createMemo(() => currentStepIndex() === 0);
  const isLastStep = createMemo(() => currentStepIndex() === props.graph.length - 1);

  // Update form data
  const updateFormData = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Determine the next step based on conditional rules
  const determineNextStep = (): string | null => {
    const step = currentStep();
    
    // If there are no edges, go to the next step in sequence
    if (!step.edges || step.edges.length === 0) {
      return isLastStep() ? null : props.graph[currentStepIndex() + 1].step.id;
    }

    // Evaluate each edge's condition against the form data
    for (const edge of step.edges) {
      const conditionMet = evaluateConditionalRule(edge, formData);
      
      if (conditionMet) {
        // If the action is to submit the form
        if (edge.action.id === 'submit') {
          return null; // Return null to indicate form submission
        }
        
        // Otherwise, the action is to go to another step
        return edge.action.id;
      }
    }

    // If no conditions are met, go to the next step in sequence
    return isLastStep() ? null : props.graph[currentStepIndex() + 1].step.id;
  };

  // Navigate to the next step
  const handleNext = () => {
    const nextStepId = determineNextStep();
    
    if (nextStepId === null) {
      // Submit the form
      handleSubmit();
      return;
    }
    
    // Find the index of the next step
    const nextIndex = props.graph.findIndex(node => node.step.id === nextStepId);
    
    if (nextIndex !== -1) {
      setCurrentStepIndex(nextIndex);
    } else {
      // If the step is not found, go to the next step in sequence
      if (!isLastStep()) {
        setCurrentStepIndex(currentStepIndex() + 1);
      }
    }
  };

  // Navigate to the previous step
  const handlePrevious = () => {
    if (!isFirstStep()) {
      setCurrentStepIndex(currentStepIndex() - 1);
    }
  };

  // Submit the form
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    try {
      if (props.onSubmit) {
        props.onSubmit(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="space-y-8">
      {/* Current step renderer */}
      <StepRenderer 
        {...currentStep()} 
        formData={formData} 
        updateFormData={updateFormData} 
      />
      
      {/* Navigation buttons */}
      <div class="flex justify-between mt-4">
        <Show when={!isFirstStep()}>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting()}
          >
            <ArrowLeft class="mr-2 h-4 w-4" />
            {currentStep().step.previousButtonLabel || "Previous"}
          </Button>
        </Show>
        
        <div class="flex-1"></div>
        
        <Button
          onClick={handleNext}
          disabled={isSubmitting()}
        >
          {isLastStep() ? (
            <>
              <CheckCircle class="mr-2 h-4 w-4" />
              Submit
            </>
          ) : (
            <>
              {currentStep().step.nextButtonLabel || "Next"}
              <ArrowRight class="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormNavigator;
