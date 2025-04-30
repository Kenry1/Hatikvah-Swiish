
import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import * as z from 'zod';

// Define the schema for the team lead form
export const teamLeadSchema = z.object({
  designation: z.literal('team_lead'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  selfEquipment: z.array(
    z.object({
      name: z.string().min(1, 'Equipment name is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'At least one equipment item is required'),
  employeeName: z.string().optional(),
  employeeEquipment: z.array(
    z.object({
      name: z.string().min(1, 'Equipment name is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
    })
  ).optional(),
  photos: z.array(z.any()).optional(),
});

type TeamLeadFormProps = {
  form: UseFormReturn<z.infer<typeof teamLeadSchema>>;
};

const TeamLeadForm: React.FC<TeamLeadFormProps> = ({ form }) => {
  const teamLeadSelfEquipment = useFieldArray({
    control: form.control,
    name: 'selfEquipment',
  });

  const teamLeadEmployeeEquipment = useFieldArray({
    control: form.control,
    name: 'employeeEquipment',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Your Equipment</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Request equipment for yourself</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => teamLeadSelfEquipment.append({ name: '', quantity: 1 })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
          
          {teamLeadSelfEquipment.fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3 border-b pb-3">
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name={`selfEquipment.${index}.name`}
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
                  name={`selfEquipment.${index}.quantity`}
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
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={() => teamLeadSelfEquipment.remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-2">Additional Employee</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter employee name" {...field} />
                </FormControl>
                <FormDescription>
                  As a team lead, you can request equipment for one additional employee.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.getValues("employeeName") && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Equipment for this employee</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => teamLeadEmployeeEquipment.append({ name: '', quantity: 1 })}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
              
              {teamLeadEmployeeEquipment.fields.map((equipField, index) => (
                <div key={equipField.id} className="flex items-end gap-3 border-b pb-3">
                  <div className="flex-grow">
                    <FormField
                      control={form.control}
                      name={`employeeEquipment.${index}.name`}
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
                      name={`employeeEquipment.${index}.quantity`}
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
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => teamLeadEmployeeEquipment.remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamLeadForm;
