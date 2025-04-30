
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SafetyEquipmentRequest } from '@/types/ehs';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import RequestStatusBadge from './RequestStatusBadge';

interface RequestDetailsDialogProps {
  request: SafetyEquipmentRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  request,
  open,
  onOpenChange
}) => {
  if (!request) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Safety Equipment Request Details</DialogTitle>
          <DialogDescription>
            Request ID: {request.requestId}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Technician Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd>{request.technicianName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">ID:</dt>
                    <dd>{request.technicianId}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Role:</dt>
                    <dd className="capitalize">{request.designation.replace('_', ' ')}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Request Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status:</dt>
                    <dd><RequestStatusBadge status={request.status} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Date:</dt>
                    <dd>{request.requestDate}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Equipment Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {request.equipment.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">Quantity: {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reason for Request</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{request.reason}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Request Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Requested:</dt>
                  <dd>{request.requestDate} by {request.technicianName}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Acknowledged:</dt>
                  <dd>
                    {request.acknowledgedBy ? 
                      `${request.acknowledgedDate} by ${request.acknowledgedBy}` : 
                      'Pending'}
                  </dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Approved:</dt>
                  <dd>
                    {request.approvedBy ? 
                      `${request.approvedDate} by ${request.approvedBy}` : 
                      'Pending'}
                  </dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Issued:</dt>
                  <dd>
                    {request.issuedBy ? 
                      `${request.issuedDate} by ${request.issuedBy}` : 
                      'Pending'}
                  </dd>
                </div>
                
                {request.status === 'closed' && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Closed:</dt>
                    <dd>
                      {request.closedDate} by {request.closedBy}
                    </dd>
                  </div>
                )}
              </dl>
              
              {request.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                  <p className="text-sm">{request.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
