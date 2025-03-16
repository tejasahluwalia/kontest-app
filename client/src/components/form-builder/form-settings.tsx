import { useFormBuilder } from "./form-builder-context";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";

export function FormSettings() {
  const { formSchema, updateFormSettings } = useFormBuilder();

  return (
    <div class="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="form-name">Form Name</Label>
            <Input
              id="form-name"
              value={formSchema.name}
              onInput={(e) => updateFormSettings({ name: e.currentTarget.value })}
            />
          </div>
          
          <div>
            <Label for="form-description">Form Description</Label>
            <TextField>
              <TextFieldTextArea
                id="form-description"
                value={formSchema.description}
                onInput={(e) => updateFormSettings({ description: e.currentTarget.value })}
                rows={4}
              />
            </TextField>
            <p class="text-xs text-muted-foreground mt-1">
              This description will be shown to applicants at the top of the form
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contest Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <TextField>
            <TextFieldTextArea
              value={formSchema.rules || ""}
              onInput={(e) => updateFormSettings({ rules: e.currentTarget.value })}
              rows={6}
              placeholder="Enter the rules for this contest..."
            />
          </TextField>
          <p class="text-xs text-muted-foreground mt-1">
            Specify the rules and guidelines that participants must follow
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <TextField>
            <TextFieldTextArea
              value={formSchema.eligibility || ""}
              onInput={(e) => updateFormSettings({ eligibility: e.currentTarget.value })}
              rows={6}
              placeholder="Enter the eligibility criteria for this contest..."
            />
          </TextField>
          <p class="text-xs text-muted-foreground mt-1">
            Specify who is eligible to participate in this contest
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
