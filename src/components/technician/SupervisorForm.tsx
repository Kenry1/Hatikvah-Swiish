
import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import * as z from 'zod';

// Define the schema for the supervisor form
export const supervisorSchema = z.object({
  designation: z.literal('supervisor'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  casuals: z.array(
    z.object({
      name: z.string().min(1, 'Casual employee name is required'),
      items: z.array(
        z.object({
          name: z.string().min(1, 'Equipment name is required'),
          quantity: z.number().min(1, 'Quantity must be at least 1'),
        })
      ).min(1, 'At least one equipment item is required'),
    })
  ).min(1, 'At least one casual employee is required'),
  photos: z.array(z.any()).optional(),
});

type SupervisorFormProps = {
  form: UseFormReturn<z.infer<typeof supervisorSchema>>;
};

const SupervisorForm: React.FC<SupervisorFormProps> = ({ form }) => {
  const supervisorCasuals = useFieldArray({
    control: form.control,
    name: 'casuals',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Casual Employees</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => supervisorCasuals.append({ 
            name: '', 
            items: [{ name: '', quantity: 1 }] 
          })}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Employee
        </Button>
      </div>
      
      {supervisorCasuals.fields.map((casualField, casualIndex) => (
        <div key={casualField.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name={`casuals.${casualIndex}.name`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Casual Employee Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter employee name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {casualIndex > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => supervisorCasuals.remove(casualIndex)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="pl-4 border-l-2 border-muted space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Equipment Items</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const casualItems = form.getValues(`casuals.${casualIndex}.items`) || [];
                  form.setValue(`casuals.${casualIndex}.items`, [
                    ...casualItems,
                    { name: '', quantity: 1 }
                  ]);
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            
            {(form.getValues(`casuals.${casualIndex}.items`) || []).map((_, itemIndex) => (
              <div key={`${casualField.id}-item-${itemIndex}`} className="flex items-end gap-3">
                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name={`casuals.${casualIndex}.items.${itemIndex}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Hard Hat" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-24">
                  <FormField
                    control={form.control}
                    name={`casuals.${casualIndex}.items.${itemIndex}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {itemIndex > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const casualItems = form.getValues(`casuals.${casualIndex}.items`) || [];
                      form.setValue(
                        `casuals.${casualIndex}.items`, 
                        casualItems.filter((_, i) => i !== itemIndex)
                      );
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupervisorForm;
