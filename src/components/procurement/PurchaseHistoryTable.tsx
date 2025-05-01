
import React, { useState } from 'react';
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
import { Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PurchaseHistoryTableProps {
  requests: PurchaseRequest[];
  onView: (request: PurchaseRequest) => void;
}

const PurchaseHistoryTable: React.FC<PurchaseHistoryTableProps> = ({
  requests,
  onView,
}) => {
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all');
  
  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'approved') return request.status === 'approved' || request.status === 'completed';
    if (filter === 'rejected') return request.status === 'rejected';
    return true;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
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

  return (
    <div>
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter} className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No {filter === 'all' ? '' : filter} requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.requester}</TableCell>
                    <TableCell>{format(new Date(request.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{request.item} (x{request.quantity})</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(request)}
                        className="h-8 w-8 p-0"
                      >
                        <span className="sr-only">View details</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseHistoryTable;
