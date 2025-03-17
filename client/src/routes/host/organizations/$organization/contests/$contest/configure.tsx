import { createFileRoute, notFound } from '@tanstack/solid-router'
import { FormBuilder } from '~/components/form-builder'
import server from '@client/lib/server-api'
import { createSignal, onMount } from 'solid-js'
import { Button } from '~/components/ui/button'
import { showToast } from '@client/components/ui/toast'
import { createDefaultFormGraph, type FormSchema } from '~/components/form-builder/primitives/form'
import { createId } from '@paralleldrive/cuid2'
import { createStore } from 'solid-js/store'

export const Route = createFileRoute(
  '/host/organizations/$organization/contests/$contest/configure',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const routeContext = Route.useRouteContext();
  // Safely access the contest property with type assertion
  const contest = () => routeContext().contest;
  const [isSaving, setIsSaving] = createSignal(false);
  const initialSchema = {
    id: createId(),
    name: contest().name,
    description: '',
    rules: '',
    eligibility: '',
    graph: createDefaultFormGraph(),
    templates: [],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSaveForm = async () => {
    // setIsSaving(true);
    // try {
    //   // In a real implementation, we would save the form schema to the server
    //   // await server.api.organizations(...).contests(...).form.put({ body: schema });
    //   console.log('Form schema to save:', schema);
    //   setFormSchema(schema);
    //   showToast({
    //     title: 'Success',
    //     description: 'Form configuration saved successfully',
    //     variant: 'success',
    //   });
    // } catch (error) {
    //   console.error('Failed to save form schema:', error);
    //   showToast({
    //     title: 'Error',
    //     description: 'Failed to save form configuration',
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setIsSaving(false);
    // }
  };

  return (
    <div class="container py-6 max-w-7xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Configure {contest().name} Form</h1>
        <Button 
          disabled={isSaving()}
          onClick={() => handleSaveForm()}
        >
          {isSaving() ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
      
      <div>
        <FormBuilder 
          initialSchema={initialSchema} 
          onSave={handleSaveForm} 
        />
      </div>
    </div>
  )
}
