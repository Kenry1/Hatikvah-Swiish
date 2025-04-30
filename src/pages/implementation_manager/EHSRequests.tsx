
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEHS } from '@/contexts/EHSContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, CheckCircle } from 'lucide-react';
import SafetyRequestTable from '@/components/ehs/SafetyRequestTable';
import RequestDetailsDialog from '@/components/ehs/RequestDetailsDialog';
import { SafetyEquipmentRequest } from '@/types/ehs';

const EHSRequests = () => {
  const { requests, acknowledgeRequest } = useEHS();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<SafetyEquipmentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter requests that are pending
  const pendingRequests = requests.filter(request => request.status === 'pending');

  const showDetails = (request: SafetyEquipmentRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleAcknowledge = (request: SafetyEquipmentRequest) => {
    acknowledgeRequest(request.id, user?.name || 'Implementation Manager');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Safety Equipment Requests</h1>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-500">EHS Portal</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Pending Safety Equipment Requests</span>
            </CardTitle>
            <CardDescription>
              Review and acknowledge safety equipment requests from technicians
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SafetyRequestTable 
              requests={pendingRequests}
              actionColumn={{
                label: "Acknowledge",
                action: handleAcknowledge,
                buttonText: "Acknowledge",
                buttonIcon: <CheckCircle className="mr-1 h-4 w-4" />
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

export default EHSRequests;
