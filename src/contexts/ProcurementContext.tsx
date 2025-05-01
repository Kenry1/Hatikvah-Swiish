
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PurchaseRequest, Supplier } from '@/types';
import { mockPurchaseRequests, mockSuppliers } from '@/data/mockProcurementData';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProcurementContextType {
  purchaseRequests: PurchaseRequest[];
  suppliers: Supplier[];
  addPurchaseRequest: (request: PurchaseRequest) => void;
  approvePurchaseRequest: (id: string) => void;
  rejectPurchaseRequest: (id: string, notes?: string) => void;
  completePurchaseRequest: (id: string, notes?: string) => void;
  getPendingRequests: () => PurchaseRequest[];
  getProcessedRequests: () => PurchaseRequest[];
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load mock data
    setPurchaseRequests(mockPurchaseRequests);
    setSuppliers(mockSuppliers);
  }, []);

  const addPurchaseRequest = (request: PurchaseRequest) => {
    setPurchaseRequests((prev) => [...prev, request]);
  };

  const approvePurchaseRequest = (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to approve a request",
        variant: "destructive",
      });
      return;
    }

    setPurchaseRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'approved',
              approvedBy: user.name,
              approvedDate: new Date().toISOString(),
            }
          : request
      )
    );

    toast({
      title: "Request Approved",
      description: `Purchase request ${id} has been approved`,
    });
  };

  const rejectPurchaseRequest = (id: string, notes?: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to reject a request",
        variant: "destructive",
      });
      return;
    }

    setPurchaseRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'rejected',
              approvedBy: user.name,
              approvedDate: new Date().toISOString(),
              notes: notes || request.notes,
            }
          : request
      )
    );

    toast({
      title: "Request Rejected",
      description: `Purchase request ${id} has been rejected`,
    });
  };

  const completePurchaseRequest = (id: string, notes?: string) => {
    setPurchaseRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'completed',
              notes: notes ? (request.notes ? `${request.notes}\n${notes}` : notes) : request.notes,
            }
          : request
      )
    );

    toast({
      title: "Request Completed",
      description: `Purchase request ${id} has been marked as completed`,
    });
  };

  const getPendingRequests = () => {
    return purchaseRequests.filter((request) => request.status === 'pending');
  };

  const getProcessedRequests = () => {
    return purchaseRequests.filter((request) => request.status !== 'pending');
  };

  const value = {
    purchaseRequests,
    suppliers,
    addPurchaseRequest,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    completePurchaseRequest,
    getPendingRequests,
    getProcessedRequests,
  };

  return <ProcurementContext.Provider value={value}>{children}</ProcurementContext.Provider>;
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (context === undefined) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
