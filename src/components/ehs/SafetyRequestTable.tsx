
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SafetyEquipmentRequest } from '@/types/ehs';
import RequestStatusBadge from './RequestStatusBadge';
import { Shield } from 'lucide-react';

interface SafetyRequestTableProps {
  requests: SafetyEquipmentRequest[];
  actionColumn?: {
    label: string;
    action: (request: SafetyEquipmentRequest) => void;
    buttonText: string;
    buttonIcon?: React.ReactNode;
    isDisabled?: (request: SafetyEquipmentRequest) => boolean;
  };
  showStatus?: boolean;
  showApprover?: boolean;
  showIssuer?: boolean;
  showNotes?: boolean;
  showDetails?: (request: SafetyEquipmentRequest) => void;
}

const SafetyRequestTable: React.FC<SafetyRequestTableProps> = ({ 
  requests, 
  actionColumn, 
  showStatus = true, 
  showApprover = false, 
  showIssuer = false,
  showNotes = false,
  showDetails
}) => {
  return (
    <div className="relative overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Equipment</TableHead>
            {showStatus && <TableHead>Status</TableHead>}
            {showApprover && <TableHead>Acknowledged By</TableHead>}
            {showIssuer && <TableHead>Issued By</TableHead>}
            {showNotes && <TableHead>Notes</TableHead>}
            {(actionColumn || showDetails) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Shield className="h-8 w-8 mb-2" />
                  <p>No safety equipment requests found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.requestId}</TableCell>
                <TableCell>{request.technicianName}</TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-5">
                    {request.equipment.slice(0, 2).map((item) => (
                      <li key={item.id} className="text-sm">
                        {item.name} (x{item.quantity})
                      </li>
                    ))}
                    {request.equipment.length > 2 && (
                      <li className="text-sm text-muted-foreground">
                        + {request.equipment.length - 2} more
                      </li>
                    )}
                  </ul>
                </TableCell>
                {showStatus && (
                  <TableCell>
                    <RequestStatusBadge status={request.status} />
                  </TableCell>
                )}
                {showApprover && (
                  <TableCell>
                    {request.acknowledgedBy || '-'}
                  </TableCell>
                )}
                {showIssuer && (
                  <TableCell>
                    {request.issuedBy || '-'}
                  </TableCell>
                )}
                {showNotes && (
                  <TableCell>
                    <span className="text-sm">
                      {request.notes || '-'}
                    </span>
                  </TableCell>
                )}
                {(actionColumn || showDetails) && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {showDetails && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => showDetails(request)}
                        >
                          Details
                        </Button>
                      )}
                      {actionColumn && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => actionColumn.action(request)}
                          disabled={actionColumn.isDisabled ? actionColumn.isDisabled(request) : false}
                        >
                          {actionColumn.buttonIcon}
                          {actionColumn.buttonText}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SafetyRequestTable;
