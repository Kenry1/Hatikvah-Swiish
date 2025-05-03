
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
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
import { 
  FileText
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MaterialRequest } from '@/types';
import { SafetyEquipmentRequest } from '@/types/ehs';

// Mock data for material requests
const mockMaterialRequests: MaterialRequest[] = [
  {
    id: 'M1',
    technicianName: 'Alex Johnson',
    items: [
      { materialId: '101', materialName: 'Fiber Cable', quantity: 5 },
      { materialId: '102', materialName: 'Connectors', quantity: 10 }
    ],
    status: 'pending',
    createdAt: '2025-05-01T10:30:00Z'
  },
  {
    id: 'M2',
    technicianName: 'Sarah Thompson',
    items: [
      { materialId: '103', materialName: 'Network Switch', quantity: 1 },
      { materialId: '104', materialName: 'Patch Panel', quantity: 2 }
    ],
    status: 'approved',
    createdAt: '2025-05-02T15:45:00Z'
  }
];

// Mock data for EHS requests
const mockEHSRequests: SafetyEquipmentRequest[] = [
  {
    id: 'E1',
    requestId: 'SR-001',
    technicianId: '1',
    technicianName: 'Michael Brown',
    designation: 'engineer',
    reason: 'New site deployment requires safety gear',
    requestDate: '2025-05-02T09:00:00Z',
    equipment: [
      { id: '1', name: 'Safety Helmet', quantity: 1 },
      { id: '2', name: 'Safety Boots', quantity: 1 }
    ],
    status: 'pending'
  },
  {
    id: 'E2',
    requestId: 'SR-002',
    technicianId: '2',
    technicianName: 'Jane Smith',
    designation: 'team_lead',
    reason: 'Team requires new safety equipment',
    requestDate: '2025-05-03T11:15:00Z',
    equipment: [
      { id: '3', name: 'Reflective Vest', quantity: 5 },
      { id: '4', name: 'Work Gloves', quantity: 5 }
    ],
    status: 'approved'
  }
];

// Mock data for asset requests
const mockAssetRequests = [
  {
    id: 'A1',
    requesterName: 'John Doe',
    department: 'Field Operations',
    assetName: 'Laptop',
    reason: 'New field engineer requires equipment',
    status: 'pending',
    createdAt: '2025-05-01T14:30:00Z'
  },
  {
    id: 'A2',
    requesterName: 'Lisa Davis',
    department: 'Customer Support',
    assetName: 'IP Phone',
    reason: 'Replacement for damaged equipment',
    status: 'approved',
    createdAt: '2025-05-02T10:45:00Z'
  }
];

// Combine all requests into a single array
const combineRequests = () => {
  const materialRequests = mockMaterialRequests.map(req => ({
    id: req.id,
    type: 'Material',
    requesterName: req.technicianName,
    description: `${req.items.length} materials requested`,
    status: req.status,
    date: req.createdAt,
    details: req
  }));
  
  const ehsRequests = mockEHSRequests.map(req => ({
    id: req.id,
    type: 'EHS',
    requesterName: req.technicianName,
    description: `${req.equipment.length} safety items requested`,
    status: req.status,
    date: req.requestDate,
    details: req
  }));
  
  const assetRequests = mockAssetRequests.map(req => ({
    id: req.id,
    type: 'Asset',
    requesterName: req.requesterName,
    description: `Request for ${req.assetName}`,
    status: req.status,
    date: req.createdAt,
    details: req
  }));
  
  return [...materialRequests, ...ehsRequests, ...assetRequests].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

const AllRequests = () => {
  const [filterType, setFilterType] = useState<string>('all');
  
  const allRequests = combineRequests();
  
  const filteredRequests = filterType === 'all' 
    ? allRequests 
    : allRequests.filter(req => req.type.toLowerCase() === filterType);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">All Requests</h1>
          <p className="mt-2 text-muted-foreground">Review all material, safety equipment, and asset requests.</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-64">
            <Select defaultValue="all" onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="material">Material Requests</SelectItem>
                <SelectItem value="ehs">EHS Requests</SelectItem>
                <SelectItem value="asset">Asset Requests</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {allRequests.length} requests
          </div>
        </div>

        <Table>
          <TableCaption>Combined list of all requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>
                  <Badge variant={
                    request.type === 'Material' ? 'default' :
                    request.type === 'EHS' ? 'secondary' : 'outline'
                  }>
                    {request.type}
                  </Badge>
                </TableCell>
                <TableCell>{request.requesterName}</TableCell>
                <TableCell>{request.description}</TableCell>
                <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={
                    request.status === 'pending' ? 'outline' :
                    request.status === 'approved' ? 'secondary' :
                    request.status === 'issued' ? 'default' :
                    'destructive'
                  }>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default AllRequests;
