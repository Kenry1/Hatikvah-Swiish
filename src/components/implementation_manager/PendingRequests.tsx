
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRequestWorkflow } from '@/contexts/RequestWorkflowContext';
import { Loader2 } from 'lucide-react';

export default function PendingRequests() {
  const { pendingIMRequests, loadingRequests, acknowledgeRequest } = useRequestWorkflow();

  if (loadingRequests) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (pendingIMRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No pending requests found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingIMRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-xs">{request.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{request.request_type}</Badge>
                </TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>
                  {request.submitter_first_name} {request.submitter_last_name}
                </TableCell>
                <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{request.request_status}</Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    onClick={() => acknowledgeRequest(request.id)}
                  >
                    Acknowledge
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
