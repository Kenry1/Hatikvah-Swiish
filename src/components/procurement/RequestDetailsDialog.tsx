
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PurchaseRequest } from '@/types';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface RequestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PurchaseRequest | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}) => {
  const { user } = useAuth();
  const isProcurement = user?.role === 'procurement';
  
  if (!request) {
    return null;
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>;
    }
  };
  
  const getUrgencyBadge = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Purchase Request Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <p className="text-sm font-medium">Request ID</p>
            <p className="text-sm text-muted-foreground">{request.id}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Status</p>
            <div>{getStatusBadge(request.status)}</div>
          </div>
          
          <div>
            <p className="text-sm font-medium">Requester</p>
            <p className="text-sm text-muted-foreground">{request.requester}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Department</p>
            <p className="text-sm text-muted-foreground">{request.department}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Date Requested</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(request.date), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Urgency</p>
            <div>{getUrgencyBadge(request.urgency)}</div>
          </div>
          
          <div className="col-span-2">
            <p className="text-sm font-medium">Item</p>
            <p className="text-sm text-muted-foreground">{request.item} (Quantity: {request.quantity})</p>
          </div>
          
          {request.supplier && (
            <div className="col-span-2">
              <p className="text-sm font-medium">Preferred Supplier</p>
              <p className="text-sm text-muted-foreground">{request.supplier}</p>
            </div>
          )}
          
          <div className="col-span-2">
            <p className="text-sm font-medium">Justification</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{request.justification}</p>
          </div>
          
          {request.approvedBy && (
            <>
              <div>
                <p className="text-sm font-medium">Approved By</p>
                <p className="text-sm text-muted-foreground">{request.approvedBy}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Approval Date</p>
                <p className="text-sm text-muted-foreground">
                  {request.approvedDate && format(new Date(request.approvedDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </>
          )}
          
          {request.notes && (
            <div className="col-span-2">
              <p className="text-sm font-medium">Additional Notes</p>
              <p className="text-sm text-muted-foreground">{request.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {isProcurement && request.status === 'pending' && onApprove && onReject && (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  onReject(request.id);
                  onOpenChange(false);
                }}
              >
                Reject
              </Button>
              <Button 
                onClick={() => {
                  onApprove(request.id);
                  onOpenChange(false);
                }}
              >
                Approve
              </Button>
            </>
          )}
          {(!isProcurement || request.status !== 'pending' || !onApprove || !onReject) && (
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
