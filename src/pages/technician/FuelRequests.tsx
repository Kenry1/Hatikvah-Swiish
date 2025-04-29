
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Fuel, Calendar, Clock, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { FuelRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock fuel request data - in a real app, this would come from Supabase
const mockFuelRequests: FuelRequest[] = [
  {
    id: "fr-001",
    technicianId: "tech-123",
    technicianName: "Alex Technician",
    fuelType: "petrol",
    amount: 45,
    purpose: "Field visit to Nairobi West site",
    status: "approved",
    createdAt: "2025-04-25T10:30:00Z"
  },
  {
    id: "fr-002",
    technicianId: "tech-123",
    technicianName: "Alex Technician",
    fuelType: "petrol",
    amount: 30,
    purpose: "Maintenance visit to Mombasa Road site",
    status: "pending",
    createdAt: "2025-04-27T14:15:00Z"
  },
  {
    id: "fr-003",
    technicianId: "tech-123",
    technicianName: "Alex Technician",
    fuelType: "diesel",
    amount: 50,
    purpose: "Emergency call to Westlands area",
    status: "completed",
    createdAt: "2025-04-22T08:45:00Z"
  }
];

interface FuelRequestFormData {
  requestTime: string;
  requestAmount: number;
  petrolStation: string;
  purpose: string;
  fuelType: 'petrol' | 'diesel' | 'electric';
  dashboardPhotos: FileList | null;
}

const FuelRequests = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fuelRequests, setFuelRequests] = useState<FuelRequest[]>(mockFuelRequests);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<FuelRequestFormData>({
    defaultValues: {
      requestTime: new Date().toISOString().slice(0, 16),
      requestAmount: 0,
      petrolStation: '',
      purpose: '',
      fuelType: 'petrol',
      dashboardPhotos: null
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Clear previous previews
    setPreviewUrls([]);
    
    // Create new previews
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removePreview = (indexToRemove: number) => {
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    
    // Reset the file input if all previews are removed
    if (previewUrls.length === 1) {
      form.setValue('dashboardPhotos', null);
    }
  };

  const onSubmit = (data: FuelRequestFormData) => {
    // In a real app, this would be a Supabase insert
    const newRequest: FuelRequest = {
      id: `fr-${Date.now().toString().slice(-5)}`,
      technicianId: user?.id || '',
      technicianName: user?.name || '',
      fuelType: data.fuelType,
      amount: data.requestAmount,
      purpose: data.purpose,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setFuelRequests([newRequest, ...fuelRequests]);
    setIsFormOpen(false);
    form.reset();
    setPreviewUrls([]);

    toast({
      title: "Fuel request submitted",
      description: "Your fuel request has been submitted and is awaiting approval."
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Fuel Requests</h1>
            <p className="text-muted-foreground">
              View and manage your fuel requests
            </p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2"
          >
            <Fuel className="h-4 w-4" />
            New Fuel Request
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Fuel Request History</CardTitle>
            <CardDescription>
              View all your previous and current fuel requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{request.amount} L</TableCell>
                    <TableCell className="capitalize">{request.fuelType}</TableCell>
                    <TableCell>{request.purpose}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(request.status)}`}></div>
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {fuelRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      You don't have any fuel requests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* New Fuel Request Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>New Fuel Request</DialogTitle>
            <DialogDescription>
              Fill out this form to request fuel for your assigned vehicle
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requestTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Request Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="requestAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (Liters)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="petrolStation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Petrol Station</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter petrol station name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the purpose for this fuel request" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="dashboard-photos" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Attach Dashboard Photos
                  </Label>
                  
                  <Input
                    id="dashboard-photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="cursor-pointer"
                    onChange={handleFileChange}
                  />
                  
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="h-20 w-full object-cover rounded-md" 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-6 w-6 bg-black/50 rounded-full p-1"
                            onClick={() => removePreview(index)}
                          >
                            <X className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FuelRequests;
