
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock data for fuel requests
const fuelRequests = [
  { 
    id: 1, 
    user: 'Alex Technician', 
    vehicle: 'Toyota Hilux (KBC 123D)', 
    amount: 45, 
    date: new Date('2025-04-25'), 
    status: 'Pending' 
  },
  { 
    id: 2, 
    user: 'Jane Engineer', 
    vehicle: 'Ford Ranger (KDD 456P)', 
    amount: 35, 
    date: new Date('2025-04-26'), 
    status: 'Pending' 
  },
  { 
    id: 3, 
    user: 'Mike Installer', 
    vehicle: 'Isuzu D-Max (KCA 789Q)', 
    amount: 50, 
    date: new Date('2025-04-27'), 
    status: 'Approved' 
  },
  { 
    id: 4, 
    user: 'Sarah Field Tech', 
    vehicle: 'Toyota Land Cruiser (KBZ 321A)', 
    amount: 65, 
    date: new Date('2025-04-28'), 
    status: 'Pending' 
  },
  { 
    id: 5, 
    user: 'David Technician', 
    vehicle: 'Nissan Navara (KDE 654M)', 
    amount: 40, 
    date: new Date('2025-04-29'), 
    status: 'Acknowledged' 
  }
];

const FuelRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState(fuelRequests);

  const handleApprove = (id) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, status: 'Approved' } : request
      )
    );
    toast({
      title: "Request Approved",
      description: `Fuel request #${id} has been approved.`,
    });
  };

  const handleAcknowledge = (id) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, status: 'Acknowledged' } : request
      )
    );
    toast({
      title: "Request Acknowledged",
      description: `Fuel request #${id} has been acknowledged.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Fuel Request Management</h1>
          <p className="text-muted-foreground">Approve and track fuel usage across the fleet.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fuel Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Requesting User</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead className="text-right">Fuel Amount</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>#{request.id}</TableCell>
                    <TableCell>{request.user}</TableCell>
                    <TableCell>{request.vehicle}</TableCell>
                    <TableCell className="text-right">{request.amount} liters</TableCell>
                    <TableCell>{format(request.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'Approved' 
                          ? 'default' 
                          : request.status === 'Pending' 
                            ? 'secondary' 
                            : 'outline'
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          disabled={request.status !== 'Pending' && request.status !== 'Acknowledged'}
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={request.status !== 'Pending'}
                          onClick={() => handleAcknowledge(request.id)}
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuel Usage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Total Requests</h3>
                <p className="text-3xl font-bold">{requests.length}</p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Pending Approval</h3>
                <p className="text-3xl font-bold">
                  {requests.filter(r => r.status === 'Pending').length}
                </p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Total Fuel Requested</h3>
                <p className="text-3xl font-bold">
                  {requests.reduce((sum, req) => sum + req.amount, 0)} liters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FuelRequests;
