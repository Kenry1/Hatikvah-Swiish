
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface RequestStatusBadgeProps {
  status: 'pending' | 'acknowledged' | 'approved' | 'issued' | 'closed';
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
    case 'acknowledged':
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Acknowledged</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
    case 'issued':
      return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Issued</Badge>;
    case 'closed':
      return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Closed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default RequestStatusBadge;
