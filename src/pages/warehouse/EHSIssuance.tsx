
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEHS } from '@/contexts/EHSContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Check, ShieldCheck } from 'lucide-react';
import SafetyRequestTable from '@/components/ehs/SafetyRequestTable';
import RequestDetailsDialog from '@/components/ehs/RequestDetailsDialog';
import { SafetyEquipmentRequest } from '@/types/ehs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EHSIssuance = () => {
  const { requests, issueEquipment } = useEHS();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<SafetyEquipmentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [issuanceDialogOpen, setIssuanceDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');

  // Filter requests that have been approved but not yet issued
  const approvedRequests = requests.filter(request => request.status === 'approved');

  const showDetails = (request: SafetyEquipmentRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const openIssuanceDialog = (request: SafetyEquipmentRequest) => {
    setSelectedRequest(request);
    setNotes('');
    setIssuanceDialogOpen(true);
  };

  const handleIssue = () => {
    if (selectedRequest) {
      issueEquipment(selectedRequest.id, user?.name || 'Warehouse Staff', notes);
      setIssuanceDialogOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Safety Equipment Issuance</h1>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-purple-500">EHS Portal</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Approved Safety Equipment Requests</span>
            </CardTitle>
            <CardDescription>
              Issue approved safety equipment to technicians
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SafetyRequestTable 
              requests={approvedRequests}
              showApprover={true}
              actionColumn={{
                label: "Issue",
                action: openIssuanceDialog,
                buttonText: "Issue Equipment",
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

        <Dialog open={issuanceDialogOpen} onOpenChange={setIssuanceDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Issue Safety Equipment</DialogTitle>
              <DialogDescription>
                Confirm equipment issuance and add any notes about unavailable items
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <h3 className="mb-2 font-medium">Equipment to Issue:</h3>
              {selectedRequest && (
                <ul className="list-disc pl-5 mb-4">
                  {selectedRequest.equipment.map((item) => (
                    <li key={item.id}>
                      {item.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              )}
              
              <Textarea
                placeholder="Add notes about any unavailable equipment or special handling instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIssuanceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleIssue}>
                <Check className="mr-1 h-4 w-4" />
                Confirm Issuance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EHSIssuance;
