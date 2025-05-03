
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Archive, List } from 'lucide-react';
import { MaterialRequest } from '@/types';

// Mock data for material requests
const mockMaterialRequests: MaterialRequest[] = [
  {
    id: '1',
    technicianName: 'Alex Johnson',
    items: [
      { materialId: '101', materialName: 'Fiber Cable', quantity: 5 },
      { materialId: '102', materialName: 'Connectors', quantity: 10 }
    ],
    status: 'pending',
    createdAt: '2025-05-01T10:30:00Z'
  },
  {
    id: '2',
    technicianName: 'Sarah Thompson',
    items: [
      { materialId: '103', materialName: 'Network Switch', quantity: 1 },
      { materialId: '104', materialName: 'Patch Panel', quantity: 2 }
    ],
    status: 'approved',
    createdAt: '2025-05-02T15:45:00Z'
  },
  {
    id: '3',
    technicianName: 'Michael Brown',
    items: [
      { materialId: '105', materialName: 'Cable Tester', quantity: 1 }
    ],
    status: 'issued',
    createdAt: '2025-05-03T09:15:00Z'
  }
];

// Mock data for issued materials
const mockIssuedMaterials = [
  {
    id: '1',
    technicianName: 'Michael Brown',
    items: [
      { materialId: '105', materialName: 'Cable Tester', quantity: 1 }
    ],
    issuedAt: '2025-05-03T10:30:00Z'
  },
  {
    id: '2',
    technicianName: 'Lisa Davis',
    items: [
      { materialId: '106', materialName: 'Ethernet Cable', quantity: 15 },
      { materialId: '107', materialName: 'RJ45 Connectors', quantity: 30 }
    ],
    issuedAt: '2025-05-02T14:00:00Z'
  }
];

const MaterialRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);

  // Sort requests from newest to oldest
  const sortedRequests = [...mockMaterialRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filter issued materials
  const issuedMaterials = mockIssuedMaterials.sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );

  const handleApprove = (id: string) => {
    console.log(`Approving request ${id}`);
    // Implementation would update the request status in the database
  };

  const handleIssue = (id: string) => {
    console.log(`Issuing materials for request ${id}`);
    // Implementation would update the request status and record the issuance
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Material Requests</h1>
          <p className="mt-2 text-muted-foreground">Review, approve, and issue materials requested by technicians.</p>
        </div>

        <Tabs defaultValue="all-requests">
          <TabsList className="w-full border-b">
            <TabsTrigger value="all-requests" className="flex items-center">
              <List className="mr-2 h-4 w-4" />
              All Material Requests
            </TabsTrigger>
            <TabsTrigger value="issued-materials" className="flex items-center">
              <Archive className="mr-2 h-4 w-4" />
              All Issued Materials
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-requests" className="pt-4">
            <Table>
              <TableCaption>List of all material requests from technicians</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Materials</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.technicianName}</TableCell>
                    <TableCell>
                      {request.items.map(item => (
                        <div key={item.materialId}>
                          {item.materialName} x{item.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          request.status === 'pending' ? 'outline' : 
                          request.status === 'approved' ? 'secondary' : 
                          request.status === 'issued' ? 'default' : 
                          'destructive'
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {request.status === 'approved' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleIssue(request.id)}
                        >
                          Issue Materials
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="issued-materials" className="pt-4">
            <Table>
              <TableCaption>List of all issued materials</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Issuance ID</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Materials</TableHead>
                  <TableHead>Date Issued</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issuedMaterials.map((issuance) => (
                  <TableRow key={issuance.id}>
                    <TableCell className="font-medium">{issuance.id}</TableCell>
                    <TableCell>{issuance.technicianName}</TableCell>
                    <TableCell>
                      {issuance.items.map(item => (
                        <div key={item.materialId}>
                          {item.materialName} x{item.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{new Date(issuance.issuedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MaterialRequests;
