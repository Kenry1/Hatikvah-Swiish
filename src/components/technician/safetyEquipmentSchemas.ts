
import * as z from 'zod';

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

export const formSchema = z.discriminatedUnion('designation', [
  engineerSchema,
  supervisorSchema,
  teamLeadSchema,
]);

export type Designation = 'engineer' | 'supervisor' | 'team_lead';
export type FormSchema = z.infer<typeof formSchema>;
export type EngineerSchema = z.infer<typeof engineerSchema>;
export type SupervisorSchema = z.infer<typeof supervisorSchema>;
export type TeamLeadSchema = z.infer<typeof teamLeadSchema>;
