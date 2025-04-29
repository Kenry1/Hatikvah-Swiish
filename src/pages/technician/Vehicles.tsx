import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Car, User, History, Fuel } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for visualizations
const mockServiceCostData = [
  { name: 'Maintenance', value: 3500, color: '#9b87f5' },
  { name: 'Repairs', value: 2800, color: '#D946EF' },
  { name: 'Parts Replacement', value: 1500, color: '#F97316' },
  { name: 'Inspection Fees', value: 800, color: '#0EA5E9' },
];

const mockFuelCostData = [
  { name: 'Jan', assigned: 400, fleet: 500 },
  { name: 'Feb', assigned: 350, fleet: 480 },
  { name: 'Mar', assigned: 430, fleet: 520 },
  { name: 'Apr', assigned: 380, fleet: 490 },
  { name: 'May', assigned: 420, fleet: 510 },
  { name: 'Jun', assigned: 390, fleet: 500 },
];

const mockMileageData = [
  { name: 'Your Car', value: 12.5 },
  { name: 'Fleet Average', value: 10.8 },
];

// Mock data for vehicle
const mockVehicleData = {
  id: 'v-123',
  model: 'Toyota Hilux',
  registration: 'KBZ 123A',
  mileage: 23456,
  fuelEfficiency: '12.5 km/l',
  lastService: '2025-03-15',
  assignedDate: '2024-12-01',
};

// Mock data for service history
const mockServiceHistory = [
  {
    id: 's-123',
    date: '2025-03-15',
    type: 'Maintenance',
    description: 'Regular service - oil change, filter replacement',
    mileage: 22500,
    cost: 450,
  },
  {
    id: 's-124',
    date: '2025-01-20',
    type: 'Repair',
    description: 'Brake pad replacement',
    mileage: 21000,
    cost: 680,
  },
  {
    id: 's-125',
    date: '2024-12-05',
    type: 'Inspection',
    description: 'Annual vehicle inspection',
    mileage: 19500,
    cost: 350,
  },
];

// Mock data for fuel history
const mockFuelHistory = [
  {
    id: 'f-123',
    date: '2025-04-12',
    amount: 45,
    station: 'Shell Westlands',
    mileage: 23000,
    cost: 7650,
  },
  {
    id: 'f-124',
    date: '2025-03-25',
    amount: 40,
    station: 'Total Energies South C',
    mileage: 22300,
    cost: 6800,
  },
  {
    id: 'f-125',
    date: '2025-03-05',
    amount: 42,
    station: 'Rubis Ngong Road',
    mileage: 21600,
    cost: 7140,
  },
];

// Mock data for users (for transfer)
const mockUsers = [
  { id: 'user-123', name: 'John Smith', role: 'technician' },
  { id: 'user-124', name: 'Alice Johnson', role: 'technician' },
  { id: 'user-125', name: 'David Wong', role: 'technician' },
];

const TransferVehicleDialog = ({ open, onOpenChange, onTransfer }: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  onTransfer: (userId: string, documents: File[]) => void 
}) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTransfer(selectedUser, documents);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Vehicle</DialogTitle>
          <DialogDescription>
            Transfer your assigned vehicle to another technician.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user">Select New Owner</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a technician" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documents">Attach Documents</Label>
              <Input id="documents" type="file" multiple onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground">
                Upload vehicle transfer forms, inspection reports, etc.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!selectedUser}>Submit Transfer Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Vehicles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  
  // In a real app, this would fetch data from Supabase
  const vehicle = mockVehicleData;
  const serviceHistory = mockServiceHistory;
  const fuelHistory = mockFuelHistory;
  
  const handleTransferVehicle = (newOwnerId: string, documents: File[]) => {
    // In a real app, this would send the transfer request to Supabase
    console.log('Transferring vehicle to:', newOwnerId, 'with documents:', documents);
    
    toast({
      title: "Transfer Request Submitted",
      description: "Your vehicle transfer request has been submitted for approval.",
    });
  };
  
  const handleUnassignVehicle = () => {
    // In a real app, this would update the vehicle assignment in Supabase
    console.log('Unassigning vehicle:', vehicle.id);
    
    toast({
      title: "Vehicle Unassigned",
      description: "The vehicle has been unassigned from you.",
    });
    setIsUnassignDialogOpen(false);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Vehicle</h1>
          <p className="text-muted-foreground">
            View and manage your assigned vehicle.
          </p>
        </div>
        
        {/* Current Vehicle */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Currently Assigned Vehicle
                </CardTitle>
                <CardDescription>Details about your assigned vehicle</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsTransferDialogOpen(true)}>
                  Transfer Ownership
                </Button>
                <Button variant="destructive" onClick={() => setIsUnassignDialogOpen(true)}>
                  Unassign Vehicle
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Model:</div>
                  <div className="text-sm">{vehicle.model}</div>
                  
                  <div className="text-sm font-medium">Registration:</div>
                  <div className="text-sm">{vehicle.registration}</div>
                  
                  <div className="text-sm font-medium">Current Mileage:</div>
                  <div className="text-sm">{vehicle.mileage.toLocaleString()} km</div>
                  
                  <div className="text-sm font-medium">Fuel Efficiency:</div>
                  <div className="text-sm">{vehicle.fuelEfficiency}</div>
                  
                  <div className="text-sm font-medium">Last Service:</div>
                  <div className="text-sm">{vehicle.lastService}</div>
                  
                  <div className="text-sm font-medium">Assigned Since:</div>
                  <div className="text-sm">{vehicle.assignedDate}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mileage Efficiency</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockMileageData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit=" km/l" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Efficiency" fill="#9b87f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Service Costs Breakdown</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockServiceCostData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockServiceCostData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Fuel Costs Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Fuel Costs Comparison
            </CardTitle>
            <CardDescription>Compare your fuel costs with fleet average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockFuelCostData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="assigned" 
                    name="Your Vehicle" 
                    stroke="#9b87f5" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fleet" 
                    name="Fleet Average" 
                    stroke="#F97316" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Service History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Vehicle Service History
            </CardTitle>
            <CardDescription>Maintenance and repair history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Description</th>
                    <th className="p-3 text-left font-medium">Mileage</th>
                    <th className="p-3 text-left font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceHistory.map(service => (
                    <tr key={service.id} className="border-b">
                      <td className="p-3">{service.date}</td>
                      <td className="p-3">{service.type}</td>
                      <td className="p-3">{service.description}</td>
                      <td className="p-3">{service.mileage.toLocaleString()} km</td>
                      <td className="p-3">${service.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Fuel History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Fuel Usage History
            </CardTitle>
            <CardDescription>Past fuel requests and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Station</th>
                    <th className="p-3 text-left font-medium">Amount (L)</th>
                    <th className="p-3 text-left font-medium">Mileage</th>
                    <th className="p-3 text-left font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelHistory.map(fuel => (
                    <tr key={fuel.id} className="border-b">
                      <td className="p-3">{fuel.date}</td>
                      <td className="p-3">{fuel.station}</td>
                      <td className="p-3">{fuel.amount}</td>
                      <td className="p-3">{fuel.mileage.toLocaleString()} km</td>
                      <td className="p-3">${fuel.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transfer Vehicle Dialog */}
      <TransferVehicleDialog 
        open={isTransferDialogOpen} 
        onOpenChange={setIsTransferDialogOpen}
        onTransfer={handleTransferVehicle}
      />
      
      {/* Unassign Confirmation Dialog */}
      <AlertDialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unassign Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unassign this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnassignVehicle}>Unassign</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Vehicles;
