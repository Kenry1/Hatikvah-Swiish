
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shield, Upload, X, Plus, User } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

// Define types for safety equipment request
type Designation = 'engineer' | 'supervisor' | 'team_lead';
type CasualEmployee = {
  name: string;
  items: {
    name: string;
    quantity: number;
  }[];
};

// Define the form schema based on designation
const engineerSchema = z.object({
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

const supervisorSchema = z.object({
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

const teamLeadSchema = z.object({
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

const formSchema = z.discriminatedUnion('designation', [
  engineerSchema,
  supervisorSchema,
  teamLeadSchema,
]);

const SafetyEquipment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [designation, setDesignation] = useState<Designation>('engineer');
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      designation: 'engineer',
      reason: '',
      equipment: [{ name: '', quantity: 1 }],
      photos: [],
    },
  });

  // Set up field arrays based on designation
  const engineerEquipment = useFieldArray({
    control: form.control,
    name: 'equipment',
  });

  const supervisorCasuals = useFieldArray({
    control: form.control,
    name: 'casuals',
  });

  const teamLeadSelfEquipment = useFieldArray({
    control: form.control,
    name: 'selfEquipment',
  });

  const teamLeadEmployeeEquipment = useFieldArray({
    control: form.control,
    name: 'employeeEquipment',
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setUploadedPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDesignationChange = (value: string) => {
    const newDesignation = value as Designation;
    setDesignation(newDesignation);
    
    // Reset form with proper default values based on designation
    if (newDesignation === 'engineer') {
      form.reset({
        designation: 'engineer',
        reason: form.getValues('reason') || '',
        equipment: [{ name: '', quantity: 1 }],
      });
    } else if (newDesignation === 'supervisor') {
      form.reset({
        designation: 'supervisor',
        reason: form.getValues('reason') || '',
        casuals: [{ 
          name: '', 
          items: [{ name: '', quantity: 1 }] 
        }],
      });
    } else if (newDesignation === 'team_lead') {
      form.reset({
        designation: 'team_lead',
        reason: form.getValues('reason') || '',
        selfEquipment: [{ name: '', quantity: 1 }],
        employeeName: '',
        employeeEquipment: [{ name: '', quantity: 1 }],
      });
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Include uploaded photos in the form data
    const formData = { ...data, photos: uploadedPhotos };
    
    console.log('Submitting safety equipment request:', formData);
    
    // In a real application, you would send this data to your API
    toast({
      title: "Request submitted",
      description: "Your safety equipment request has been submitted successfully.",
    });
    
    // Navigate back to dashboard
    navigate('/technician');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Safety Equipment Request</h1>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Request Form</CardTitle>
            <CardDescription>
              Please fill out this form to request safety equipment based on your designation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Designation</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleDesignationChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your designation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineer">Engineer</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="team_lead">Team Lead</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Your designation determines what type of request you can make.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Request</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please explain why you need this safety equipment..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Engineer Form Fields */}
                  {designation === 'engineer' && (
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
                  )}

                  {/* Supervisor Form Fields */}
                  {designation === 'supervisor' && (
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
                  )}

                  {/* Team Lead Form Fields */}
                  {designation === 'team_lead' && (
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
                          
                          {field.value && (
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
                              
                              {teamLeadEmployeeEquipment.fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-3 border-b pb-3">
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
                  )}

                  {/* Photo Upload - Common for all designations */}
                  <div className="space-y-3">
                    <Label>Attach Photos (Optional)</Label>
                    <div className="border-dashed border-2 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <Label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p>Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      </Label>
                    </div>
                    
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Uploaded Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {uploadedPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border">
                                <img 
                                  src={URL.createObjectURL(photo)} 
                                  alt={`Uploaded ${index + 1}`} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePhoto(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/technician')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SafetyEquipment;
