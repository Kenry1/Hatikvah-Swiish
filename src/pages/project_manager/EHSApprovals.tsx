
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEHS } from '@/contexts/EHSContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Check } from 'lucide-react';
import SafetyRequestTable from '@/components/ehs/SafetyRequestTable';
import RequestDetailsDialog from '@/components/ehs/RequestDetailsDialog';
import { SafetyEquipmentRequest } from '@/types/ehs';

const EHSApprovals = () => {
  const { requests, approveRequest } = useEHS();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<SafetyEquipmentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter requests that have been acknowledged but not yet approved
  const acknowledgedRequests = requests.filter(request => request.status === 'acknowledged');

  const showDetails = (request: SafetyEquipmentRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleApprove = (request: SafetyEquipmentRequest) => {
    approveRequest(request.id, user?.name || 'Project Manager');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Safety Equipment Approvals</h1>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-500">EHS Portal</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Acknowledged Safety Equipment Requests</span>
            </CardTitle>
            <CardDescription>
              Review and approve safety equipment requests acknowledged by Implementation Managers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SafetyRequestTable 
              requests={acknowledgedRequests}
              showApprover={true}
              actionColumn={{
                label: "Approve",
                action: handleApprove,
                buttonText: "Approve",
                buttonIcon: <Check className="mr-1 h-4 w-4" />
              }}
              showDetails={showDetails}
            />
          </CardContent>
        </Card>

        <RequestDetailsDialog 
          request={selectedRequest}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default EHSApprovals;
