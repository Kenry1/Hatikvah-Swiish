
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEHS } from '@/contexts/EHSContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Check, Search, FileText } from 'lucide-react';
import SafetyRequestTable from '@/components/ehs/SafetyRequestTable';
import RequestDetailsDialog from '@/components/ehs/RequestDetailsDialog';
import { SafetyEquipmentRequest } from '@/types/ehs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EHSOverview = () => {
  const { requests, closeRequest } = useEHS();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<SafetyEquipmentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter(request => 
    request.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.technicianName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter requests by status
  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const acknowledgedRequests = filteredRequests.filter(r => r.status === 'acknowledged');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const issuedRequests = filteredRequests.filter(r => r.status === 'issued');
  const closedRequests = filteredRequests.filter(r => r.status === 'closed');

  const showDetails = (request: SafetyEquipmentRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleClose = (request: SafetyEquipmentRequest) => {
    closeRequest(request.id, user?.name || 'EHS Officer');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Safety Equipment Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">EHS Portal</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by request ID or technician name" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-6 max-w-xl">
            <TabsTrigger value="all">All ({filteredRequests.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="issued">Issued ({issuedRequests.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>All Safety Equipment Requests</span>
                </CardTitle>
                <CardDescription>
                  Complete lifecycle view of all safety equipment requests in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SafetyRequestTable 
                  requests={filteredRequests}
                  showApprover={true}
                  showIssuer={true}
                  showNotes={true}
                  actionColumn={{
                    label: "Close",
                    action: handleClose,
                    buttonText: "Close Request",
                    buttonIcon: <Check className="mr-1 h-4 w-4" />,
                    isDisabled: (request) => request.status !== 'issued'
                  }}
                  showDetails={showDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Requests waiting for acknowledgment</CardDescription>
              </CardHeader>
              <CardContent>
                <SafetyRequestTable 
                  requests={pendingRequests}
                  showDetails={showDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acknowledged">
            <Card>
              <CardHeader>
                <CardTitle>Acknowledged Requests</CardTitle>
                <CardDescription>Requests acknowledged by Implementation Managers</CardDescription>
              </CardHeader>
              <CardContent>
                <SafetyRequestTable 
                  requests={acknowledgedRequests}
                  showApprover={true}
                  showDetails={showDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Requests</CardTitle>
                <CardDescription>Requests approved by Project Managers</CardDescription>
              </CardHeader>
              <CardContent>
                <SafetyRequestTable 
                  requests={approvedRequests}
                  showApprover={true}
                  showDetails={showDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issued">
            <Card>
              <CardHeader>
                <CardTitle>Issued Requests</CardTitle>
                <CardDescription>Equipment issued by Warehouse staff</CardDescription>
              </CardHeader>
              <CardContent>
                <SafetyRequestTable 
                  requests={issuedRequests}
                  showApprover={true}
                  showIssuer={true}
                  showNotes={true}
                  actionColumn={{
                    label: "Close",
                    action: handleClose,
                    buttonText: "Close Request",
                    buttonIcon: <Check className="mr-1 h-4 w-4" />
                  }}
                  showDetails={showDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="closed">
            <Card>
              <CardHeader>
                <CardTitle>Closed Requests</CardTitle>
                <CardDescription>Completed request lifecycle</CardDescription>
              </CardHeader>
              <CardContent>
                <SafetyRequestTable 
                  requests={closedRequests}
                  showApprover={true}
                  showIssuer={true}
                  showNotes={true}
                  showDetails={showDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <RequestDetailsDialog 
          request={selectedRequest}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default EHSOverview;
