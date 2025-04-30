
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  vehicle: z.string().min(1, {
    message: "Please select a vehicle.",
  }),
  user: z.string().min(1, {
    message: "Please select a user.",
  }),
});

// Mock data
const availableVehicles = [
  { id: 'v1', name: 'Toyota Hilux (KBC 123D)' },
  { id: 'v2', name: 'Ford Ranger (KDD 456P)' },
  { id: 'v3', name: 'Isuzu D-Max (KCA 789Q)' },
  { id: 'v4', name: 'Nissan Navara (KDE 654M)' },
  { id: 'v5', name: 'Mitsubishi L200 (KDF 987N)' },
];

const users = [
  { id: 'u1', name: 'Alex Technician' },
  { id: 'u2', name: 'Jane Engineer' },
  { id: 'u3', name: 'Mike Installer' },
  { id: 'u4', name: 'Sarah Field Tech' },
  { id: 'u5', name: 'David Technician' },
];

const AssignVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle: "",
      user: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would save to a database
    console.log(values);
    
    const selectedVehicle = availableVehicles.find(v => v.id === values.vehicle);
    const selectedUser = users.find(u => u.id === values.user);
    
    toast({
      title: "Vehicle Assigned",
      description: `${selectedVehicle?.name} has been assigned to ${selectedUser?.name}.`,
    });
    
    navigate('/logistics/vehicles');
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Assign Vehicle</h1>
          <p className="text-muted-foreground">Assign a vehicle to a user in the system.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Assignment</CardTitle>
            <CardDescription>
              Select a vehicle and a user to create an assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="vehicle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Vehicle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableVehicles.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" type="button" onClick={() => navigate('/logistics/vehicles')}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Assign Vehicle
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssignVehicle;
