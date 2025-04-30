
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SafetyEquipmentRequest } from '@/types/ehs';
import { mockSafetyRequests } from '@/data/mockEhsData';
import { useToast } from "@/hooks/use-toast";

interface EHSContextType {
  requests: SafetyEquipmentRequest[];
  acknowledgeRequest: (requestId: string, managerName: string) => void;
  approveRequest: (requestId: string, managerName: string) => void;
  issueEquipment: (requestId: string, warehouseName: string, notes?: string) => void;
  closeRequest: (requestId: string, ehsName: string) => void;
}

const EHSContext = createContext<EHSContextType | undefined>(undefined);

export function EHSProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<SafetyEquipmentRequest[]>(mockSafetyRequests);
  const { toast } = useToast();

  const acknowledgeRequest = (requestId: string, managerName: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? {
            ...request,
            status: 'acknowledged',
            acknowledgedBy: managerName,
            acknowledgedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
    
    toast({
      title: "Request Acknowledged",
      description: `Safety equipment request ${requestId} has been acknowledged.`
    });
  };

  const approveRequest = (requestId: string, managerName: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? {
            ...request,
            status: 'approved',
            approvedBy: managerName,
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
    
    toast({
      title: "Request Approved",
      description: `Safety equipment request ${requestId} has been approved.`
    });
  };

  const issueEquipment = (requestId: string, warehouseName: string, notes?: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? {
            ...request,
            status: 'issued',
            issuedBy: warehouseName,
            issuedDate: new Date().toISOString().split('T')[0],
            notes: notes || request.notes
          }
        : request
    ));
    
    toast({
      title: "Equipment Issued",
      description: `Safety equipment for request ${requestId} has been issued.`
    });
  };

  const closeRequest = (requestId: string, ehsName: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? {
            ...request,
            status: 'closed',
            closedBy: ehsName,
            closedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
    
    toast({
      title: "Request Closed",
      description: `Safety equipment request ${requestId} has been closed.`
    });
  };

  return (
    <EHSContext.Provider value={{ 
      requests, 
      acknowledgeRequest,
      approveRequest,
      issueEquipment,
      closeRequest
    }}>
      {children}
    </EHSContext.Provider>
  );
}

export const useEHS = () => {
  const context = useContext(EHSContext);
  if (context === undefined) {
    throw new Error('useEHS must be used within an EHSProvider');
  }
  return context;
};
