
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRequestWorkflow } from '@/contexts/RequestWorkflowContext';
import { Loader2, DollarSign } from 'lucide-react';

export default function PendingFinanceApprovals() {
  const { pendingFinanceRequests, loadingRequests, approveFinanceRequest } = useRequestWorkflow();

  if (loadingRequests) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (pendingFinanceRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finance Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No pending finance approvals.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>PM Approval Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingFinanceRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-xs">{request.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{request.request_type}</Badge>
                </TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>
                  {request.amount ? `${request.amount} ${request.units || ''}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {request.pm_approved_at ? new Date(request.pm_approved_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    Pending Finance
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    onClick={() => approveFinanceRequest(request.id)}
                    className="flex items-center gap-1"
                  >
                    <DollarSign className="h-4 w-4" />
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
