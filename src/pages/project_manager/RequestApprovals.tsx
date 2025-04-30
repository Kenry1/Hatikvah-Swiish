
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Check, X, Filter } from "lucide-react";
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from "@/hooks/use-toast";

// Mock data for requests
const mockRequests = [
  {
    id: 'FR001',
    type: 'Fuel',
    requesterId: 'T123',
    requesterName: 'Alex Johnson',
    role: 'Technician',
    details: {
      fuelType: 'Diesel',
      amount: '50L',
      purpose: 'Site visit to Northern Branch'
    },
    cost: 75.50,
    date: '2025-05-01',
    status: 'Pending',
    imAcknowledged: true,
    imName: 'Sarah Williams',
    imDate: '2025-05-02'
  },
  {
    id: 'MR002',
    type: 'Material',
    requesterId: 'T456',
    requesterName: 'Michael Brown',
    role: 'Technician',
    details: {
      materials: [
        { name: 'Copper Wire', quantity: '500m' },
        { name: 'Junction Boxes', quantity: '20 units' }
      ],
      purpose: 'Network installation at East Tower'
    },
    cost: 350.75,
    date: '2025-05-03',
    status: 'Pending',
    imAcknowledged: true,
    imName: 'David Miller',
    imDate: '2025-05-04'
  },
  {
    id: 'ER003',
    type: 'EHS Equipment',
    requesterId: 'W789',
    requesterName: 'Emily Davis',
    role: 'Warehouse',
    details: {
      equipment: [
        { name: 'Safety Helmets', quantity: '10' },
        { name: 'High-Vis Jackets', quantity: '10' }
      ],
      purpose: 'New safety requirements for site visits'
    },
    cost: 420.00,
    date: '2025-05-05',
    status: 'Pending',
    imAcknowledged: false,
    imName: '',
    imDate: ''
  }
];

// Completed requests
const completedRequests = [
  {
    id: 'FR004',
    type: 'Fuel',
    requesterId: 'T123',
    requesterName: 'Alex Johnson',
    role: 'Technician',
    details: {
      fuelType: 'Petrol',
      amount: '30L',
      purpose: 'Client meeting at South Office'
    },
    cost: 45.25,
    date: '2025-04-25',
    status: 'Approved',
    imAcknowledged: true,
    imName: 'Sarah Williams',
    imDate: '2025-04-26',
    pmName: 'Robert Chen',
    pmDate: '2025-04-27'
  },
  {
    id: 'MR005',
    type: 'Material',
    requesterId: 'T456',
    requesterName: 'Michael Brown',
    role: 'Technician',
    details: {
      materials: [
        { name: 'Fiber Optic Cable', quantity: '200m' },
        { name: 'Network Switches', quantity: '5 units' }
      ],
      purpose: 'Network maintenance at City Hall'
    },
    cost: 890.50,
    date: '2025-04-20',
    status: 'Rejected',
    imAcknowledged: true,
    imName: 'David Miller',
    imDate: '2025-04-21',
    pmName: 'Robert Chen',
    pmDate: '2025-04-22',
    rejectionReason: 'Requested materials exceed project budget allocation. Please revise the request.'
  }
];

const RequestApprovals = () => {
  const [activeRequests, setActiveRequests] = useState([...mockRequests]);
  const [requestFilter, setRequestFilter] = useState('all');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  
  const { toast } = useToast();
  
  const handleFilterChange = (filter: string) => {
    setRequestFilter(filter);
    
    if (filter === 'all') {
      setActiveRequests([...mockRequests]);
    } else {
      setActiveRequests(mockRequests.filter(request => request.type.toLowerCase() === filter));
    }
  };
  
  const viewDetails = (request: any) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };
  
  const handleApprove = () => {
    toast({
      title: "Request Approved",
      description: `Request ${selectedRequest.id} has been approved successfully.`,
    });
    setApprovalDialog(false);
    setDetailsOpen(false);
    setApprovalNotes('');
  };
  
  const handleReject = () => {
    toast({
      title: "Request Rejected",
      description: `Request ${selectedRequest.id} has been rejected.`,
    });
    setRejectionDialog(false);
    setDetailsOpen(false);
    setRejectionReason('');
  };
  
  const getStatusBadge = (status: string, imAcknowledged: boolean) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'Pending':
        return imAcknowledged ? 
          <Badge className="bg-blue-500">Pending PM Approval</Badge> : 
          <Badge variant="outline">Awaiting IM</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Request Approvals</h1>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-500">Request Management</span>
          </div>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="completed">Completed Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Requests</CardTitle>
                <CardDescription>
                  Review and approve pending requests from team members
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter by type:</span>
                  <div className="flex space-x-1">
                    <Button 
                      variant={requestFilter === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFilterChange('all')}
                    >
                      All
                    </Button>
                    <Button 
                      variant={requestFilter === 'fuel' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFilterChange('fuel')}
                    >
                      Fuel
                    </Button>
                    <Button 
                      variant={requestFilter === 'material' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFilterChange('material')}
                    >
                      Material
                    </Button>
                    <Button 
                      variant={requestFilter === 'ehs' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFilterChange('ehs')}
                    >
                      EHS
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.requesterName}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>{getStatusBadge(request.status, request.imAcknowledged)}</TableCell>
                        <TableCell>${request.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewDetails(request)}
                            disabled={!request.imAcknowledged}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completed Requests</CardTitle>
                <CardDescription>
                  History of approved and rejected requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Decision Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Decided By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.requesterName}</TableCell>
                        <TableCell>{request.pmDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status, true)}</TableCell>
                        <TableCell>${request.cost.toFixed(2)}</TableCell>
                        <TableCell>{request.pmName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          {selectedRequest && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Request Details - {selectedRequest.id}</DialogTitle>
                <DialogDescription>
                  Review the request details before making a decision
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 my-4">
                <div>
                  <h3 className="font-semibold mb-2">Request Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{selectedRequest.type} Request</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requested On:</span>
                      <span>{selectedRequest.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(selectedRequest.status, selectedRequest.imAcknowledged)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Cost:</span>
                      <span className="font-medium">${selectedRequest.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Requester Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedRequest.requesterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span>{selectedRequest.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span>{selectedRequest.requesterId}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-3 mb-4">
                <h3 className="font-semibold mb-2">Request Details</h3>
                {selectedRequest.type === 'Fuel' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel Type:</span>
                      <span>{selectedRequest.details.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span>{selectedRequest.details.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purpose:</span>
                      <span>{selectedRequest.details.purpose}</span>
                    </div>
                  </div>
                )}
                
                {(selectedRequest.type === 'Material' || selectedRequest.type === 'EHS Equipment') && (
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground block mb-1">Items:</span>
                      <ul className="list-disc pl-5">
                        {(selectedRequest.details.materials || selectedRequest.details.equipment).map((item: any, index: number) => (
                          <li key={index}>
                            {item.name}: {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purpose:</span>
                      <span>{selectedRequest.details.purpose}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border rounded-md p-3 mb-4">
                <h3 className="font-semibold mb-2">Approval History</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Implementation Manager:</span>
                    <div>
                      {selectedRequest.imAcknowledged ? (
                        <div className="text-right">
                          <span className="text-green-600 font-medium">Acknowledged</span>
                          <p className="text-xs text-muted-foreground">
                            by {selectedRequest.imName} on {selectedRequest.imDate}
                          </p>
                        </div>
                      ) : (
                        <span className="text-amber-500">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => setDetailsOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setRejectionDialog(true);
                      setDetailsOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      setApprovalDialog(true);
                      setDetailsOpen(false);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
        
        <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Approve Request</DialogTitle>
              <DialogDescription>
                Add any notes before approving this request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Textarea
                placeholder="Add any notes about this approval (optional)"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>
            <DialogFooter className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setApprovalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove}>
                <Check className="h-4 w-4 mr-1" />
                Confirm Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Textarea
                placeholder="Enter rejection reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setRejectionDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason}>
                <X className="h-4 w-4 mr-1" />
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RequestApprovals;
