import {
  createSignal,
  createMemo,
  createEffect,
  type Component,
  Show,
  For,
  batch,
} from "solid-js";
import { Button } from "@client/components/ui/button";
import type {
  FormGraph,
  InputFormData,
  StepGraphNode,
} from "../primitives/form";
import { evaluateConditionalRule } from "../primitives/conditions";
import StepRenderer from "./renderers/step-renderer";
import ArrowRight from "lucide-solid/icons/arrow-right";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import CheckCircle from "lucide-solid/icons/check-circle";
import { createStore } from "solid-js/store";

interface FormNavigatorProps {
  graph: FormGraph;
  onSubmit?: (formData: InputFormData) => void;
  initialData?: InputFormData;
}

const FormNavigator: Component<FormNavigatorProps> = (props) => {
  // State for form data and current step
  const [formData, setFormData] = createStore<InputFormData>(
    props.initialData || {},
  );
  const [currentStep, setCurrentStep] = createSignal(props.graph[0]);
  const [previousSteps, setPreviousSteps] = createSignal<StepGraphNode[]>([]);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isLastStep, setIsLastStep] = createSignal(false);

  createEffect(() => {
    console.log(formData);
    // Update the form data when the current step changes
    // setFormData(props.initialData || {});
  });

  const isFirstStep = () => previousSteps().length === 0;

  // Determine the next step based on conditional rules
  const determineNextStep = (): StepGraphNode | null => {
    const node = currentStep();

    // Evaluate each edge's condition against the form data
    for (const edge of node?.edges || []) {
      const conditionMet = evaluateConditionalRule(edge, formData);

      if (conditionMet) {
        // If the action is to submit the form
        if (edge.action.id === "submit") {
          setIsLastStep(true);
          return null; // Return null to indicate form submission
        }

        // Otherwise, the action is to go to another step
        return (
          props.graph.find((node) => node.step.id === edge.action.id) || null
        );
      }
    }

    // No conditions met. This should never happen. All nodes should have at least one fallback edge.
    throw new Error("No next step found");
  };

  // Navigate to the next step
  const handleNext = () => {
    const nextStep = determineNextStep();

    if (nextStep === null) {
      // Submit the form
      handleSubmit();
      return;
    }

    batch(() => {
      setPreviousSteps((prev) => [...prev, currentStep()]);
      setCurrentStep(nextStep);
    });
  };

  // Navigate to the previous step
  const handlePrevious = () => {
    if (!isFirstStep()) {
      batch(() => {
        setCurrentStep(previousSteps()[previousSteps().length - 1]);
        setPreviousSteps((prev) => prev.slice(0, -1));
      });
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
        node={currentStep()}
        formData={formData}
        updateFormData={setFormData}
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

        <Button onClick={handleNext} disabled={isSubmitting()}>
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
