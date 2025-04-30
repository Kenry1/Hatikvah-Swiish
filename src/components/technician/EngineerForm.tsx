
import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import * as z from 'zod';

// Define the schema for the engineer form
export const engineerSchema = z.object({
  designation: z.literal('engineer'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  equipment: z.array(
    z.object({
      name: z.string().min(1, 'Equipment name is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'At least one equipment item is required'),
  photos: z.array(z.any()).optional(),
});

type EngineerFormProps = {
  form: UseFormReturn<z.infer<typeof engineerSchema>>;
};

const EngineerForm: React.FC<EngineerFormProps> = ({ form }) => {
  const engineerEquipment = useFieldArray({
    control: form.control,
    name: 'equipment',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Equipment Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => engineerEquipment.append({ name: '', quantity: 1 })}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </div>
      
      {engineerEquipment.fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-3 border-b pb-3">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name={`equipment.${index}.name`}
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
              name={`equipment.${index}.quantity`}
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
              onClick={() => engineerEquipment.remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EngineerForm;
