
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRequestWorkflow } from '@/contexts/RequestWorkflowContext';
import { Loader2, CheckCircle2, FileCheck } from 'lucide-react';

export default function ApprovedRequestsReport() {
  const { approvedRequests, loadingRequests } = useRequestWorkflow();

  if (loadingRequests) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (approvedRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Approved Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No approved requests to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Approved Requests</CardTitle>
        <FileCheck className="h-5 w-5 text-green-600" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Finance Approved</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-xs">{request.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{request.request_type}</Badge>
                </TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>
                  {request.submitter_first_name} {request.submitter_last_name}
                </TableCell>
                <TableCell>
                  {request.amount ? `${request.amount} ${request.units || ''}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {request.finance_approved_at ? new Date(request.finance_approved_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
