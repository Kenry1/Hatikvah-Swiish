
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PurchaseRequest } from '@/types';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PendingRequestsTableProps {
  requests: PurchaseRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (request: PurchaseRequest) => void;
}

const PendingRequestsTable: React.FC<PendingRequestsTableProps> = ({
  requests,
  onApprove,
  onReject,
  onView,
}) => {
  const { user } = useAuth();
  const isProcurement = user?.role === 'procurement';
  
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Dept</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No pending requests found.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.requester}</TableCell>
                <TableCell>{format(new Date(request.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{request.item} (x{request.quantity})</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onView(request)}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">View details</span>
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {isProcurement && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onApprove(request.id)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <span className="sr-only">Approve</span>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onReject(request.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <span className="sr-only">Reject</span>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingRequestsTable;
