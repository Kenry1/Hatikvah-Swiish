
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Plus, Check, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { MaterialRequest, MaterialRequestItem, Material } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app, this would come from Supabase
const mockMaterials: Material[] = [
  { id: 'm-001', name: 'Cable Ties (100pk)', stockQuantity: 150, category: 'Consumables' },
  { id: 'm-002', name: 'Electrical Tape', stockQuantity: 75, category: 'Consumables' },
  { id: 'm-003', name: 'Screwdriver Set', stockQuantity: 20, category: 'Tools' },
  { id: 'm-004', name: 'Cat6 Cable (100m)', stockQuantity: 35, category: 'Networking' },
  { id: 'm-005', name: 'Safety Gloves', stockQuantity: 50, category: 'PPE' }
];

const mockMaterialRequests: MaterialRequest[] = [
  {
    id: 'mr-001',
    technicianId: 'tech-123',
    technicianName: 'Alex Technician',
    items: [
      { materialId: 'm-001', materialName: 'Cable Ties (100pk)', quantity: 2 },
      { materialId: 'm-002', materialName: 'Electrical Tape', quantity: 3 }
    ],
    status: 'approved',
    createdAt: '2025-04-24T09:15:30Z'
  },
  {
    id: 'mr-002',
    technicianId: 'tech-123',
    technicianName: 'Alex Technician',
    items: [
      { materialId: 'm-003', materialName: 'Screwdriver Set', quantity: 1 },
      { materialId: 'm-004', materialName: 'Cat6 Cable (100m)', quantity: 2 }
    ],
    status: 'pending',
    createdAt: '2025-04-26T13:45:20Z'
  }
];

// For simulating assigned materials to the technician
const mockAssignedMaterials = [
  { id: 'am-001', materialId: 'm-001', materialName: 'Cable Ties (100pk)', quantity: 5, isUsed: false },
  { id: 'am-002', materialId: 'm-002', materialName: 'Electrical Tape', quantity: 7, isUsed: false },
  { id: 'am-003', materialId: 'm-005', materialName: 'Safety Gloves', quantity: 2, isUsed: true },
  { id: 'am-004', materialId: 'm-003', materialName: 'Screwdriver Set', quantity: 1, isUsed: false }
];

interface MaterialFormData {
  items: {
    materialId: string;
    quantity: number;
  }[];
}

const MaterialRequests = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(mockMaterialRequests);
  const [assignedMaterials, setAssignedMaterials] = useState(mockAssignedMaterials);
  const { toast } = useToast();

  // Form for new material request
  const form = useForm<MaterialFormData>({
    defaultValues: {
      items: [{ materialId: '', quantity: 1 }]
    }
  });

  const { fields, append, remove } = form.control._fields.items || { fields: [] };

  const onSubmit = (data: MaterialFormData) => {
    // Filter out any empty item selections
    const validItems = data.items.filter(item => item.materialId !== '');
    
    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one material",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would be a Supabase insert
    const newRequest: MaterialRequest = {
      id: `mr-${Date.now().toString().slice(-5)}`,
      technicianId: user?.id || '',
      technicianName: user?.name || '',
      items: validItems.map(item => {
        const material = mockMaterials.find(m => m.id === item.materialId);
        return {
          materialId: item.materialId,
          materialName: material?.name || 'Unknown Material',
          quantity: item.quantity
        };
      }),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setMaterialRequests([newRequest, ...materialRequests]);
    setIsFormOpen(false);
    form.reset({
      items: [{ materialId: '', quantity: 1 }]
    });

    toast({
      title: "Material request submitted",
      description: "Your material request has been submitted and is awaiting approval."
    });
  };

  const markAsUsed = (materialId: string) => {
    setAssignedMaterials(prev => 
      prev.map(material => 
        material.id === materialId ? { ...material, isUsed: true } : material
      )
    );

    toast({
      title: "Material marked as used",
      description: "This material has been marked as used in the system."
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'issued': return 'bg-purple-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Material Requests</h1>
            <p className="text-muted-foreground">
              View and manage your material requests
            </p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            New Material Request
          </Button>
        </div>

        {/* Assigned Materials Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Materials</CardTitle>
            <CardDescription>
              Materials currently assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.materialName}</TableCell>
                    <TableCell>{material.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${material.isUsed ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                        <span>{material.isUsed ? 'Used' : 'Available'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsUsed(material.id)} 
                        disabled={material.isUsed}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Mark as Used
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {assignedMaterials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      You don't have any assigned materials.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Material Requests History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Material Request History</CardTitle>
            <CardDescription>
              View all your previous and current material requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {request.items.map((item, index) => (
                          <li key={index}>
                            {item.materialName} ({item.quantity})
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(request.status)}`}></div>
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {materialRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      You don't have any material requests yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* New Material Request Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>New Material Request</DialogTitle>
            <DialogDescription>
              Request materials from the warehouse
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {Array.isArray(form.control._fields.items?.fields) && form.control._fields.items.fields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.materialId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{index === 0 ? 'Material' : ''}</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                  {...field}
                                >
                                  <option value="">Select a material</option>
                                  {mockMaterials.map((material) => (
                                    <option key={material.id} value={material.id}>
                                      {material.name} (Stock: {material.stockQuantity})
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-24">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{index === 0 ? 'Qty' : ''}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
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
                          onClick={() => remove(index)}
                          className="mb-0.5"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ materialId: '', quantity: 1 })}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Material
                </Button>
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

export default MaterialRequests;
