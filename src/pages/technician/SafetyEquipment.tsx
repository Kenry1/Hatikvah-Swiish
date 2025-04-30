
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Import the components we created
import EngineerForm from '@/components/technician/EngineerForm';
import SupervisorForm from '@/components/technician/SupervisorForm';
import TeamLeadForm from '@/components/technician/TeamLeadForm';
import PhotoUpload from '@/components/technician/PhotoUpload';
import { formSchema, Designation } from '@/components/technician/safetyEquipmentSchemas';

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
                  {/* Designation Selection */}
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

                  {/* Reason Field - Common for all designations */}
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

                  {/* Render the appropriate form based on designation */}
                  {designation === 'engineer' && <EngineerForm form={form as any} />}
                  {designation === 'supervisor' && <SupervisorForm form={form as any} />}
                  {designation === 'team_lead' && <TeamLeadForm form={form as any} />}

                  {/* Photo Upload - Common for all designations */}
                  <PhotoUpload 
                    uploadedPhotos={uploadedPhotos} 
                    setUploadedPhotos={setUploadedPhotos} 
                  />
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
