
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RequestReport {
  id: string;
  submitter_id: string;
  title: string;
  description: string | null;
  request_type: string;
  amount: number | null;
  units: string | null;
  request_status: string;
  request_date: string;
  implementation_manager_status: string | null;
  project_manager_status: string | null;
  finance_status: string | null;
  im_acknowledged_at: string | null;
  pm_approved_at: string | null;
  finance_approved_at: string | null;
  submitter_first_name: string | null;
  submitter_last_name: string | null;
  submitter_department: string | null;
  implementation_manager_first_name: string | null;
  implementation_manager_last_name: string | null;
  project_manager_first_name: string | null;
  project_manager_last_name: string | null;
  finance_manager_first_name: string | null;
  finance_manager_last_name: string | null;
}

interface RequestWorkflowContextType {
  pendingIMRequests: RequestReport[];
  pendingPMRequests: RequestReport[];
  pendingFinanceRequests: RequestReport[];
  approvedRequests: RequestReport[];
  loadingRequests: boolean;
  acknowledgeRequest: (requestId: string) => Promise<void>;
  approvePMRequest: (requestId: string) => Promise<void>;
  approveFinanceRequest: (requestId: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const RequestWorkflowContext = createContext<RequestWorkflowContextType | undefined>(undefined);

export function RequestWorkflowProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingIMRequests, setPendingIMRequests] = useState<RequestReport[]>([]);
  const [pendingPMRequests, setPendingPMRequests] = useState<RequestReport[]>([]);
  const [pendingFinanceRequests, setPendingFinanceRequests] = useState<RequestReport[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<RequestReport[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);

  // Fetch all request types based on user role
  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);

      // Get user role first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, department')
        .eq('id', user?.id)
        .single();
        
      const userRole = profileData?.role;
      
      // Based on role, fetch appropriate requests
      if (userRole === 'implementation_manager') {
        await fetchPendingIMRequests();
      } else if (userRole === 'project_manager') {
        await fetchPendingPMRequests();
      } else if (userRole === 'finance') {
        await fetchPendingFinanceRequests();
      } else if (userRole === 'logistics') {
        await fetchApprovedRequests();
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load request data.',
        variant: 'destructive'
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchPendingIMRequests = async () => {
    const { data, error } = await supabase
      .rpc('get_pending_im_requests');
    
    if (error) {
      console.error('Error fetching IM requests:', error);
      return;
    }
    
    setPendingIMRequests(data || []);
  };

  const fetchPendingPMRequests = async () => {
    const { data, error } = await supabase
      .rpc('get_pending_pm_requests');
    
    if (error) {
      console.error('Error fetching PM requests:', error);
      return;
    }
    
    setPendingPMRequests(data || []);
  };

  const fetchPendingFinanceRequests = async () => {
    const { data, error } = await supabase
      .rpc('get_pending_finance_requests');
    
    if (error) {
      console.error('Error fetching finance requests:', error);
      return;
    }
    
    setPendingFinanceRequests(data || []);
  };

  const fetchApprovedRequests = async () => {
    const { data, error } = await supabase
      .rpc('get_approved_requests_for_logistics');
    
    if (error) {
      console.error('Error fetching approved requests:', error);
      return;
    }
    
    setApprovedRequests(data || []);
  };

  const acknowledgeRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .rpc('acknowledge_request', {
          p_request_id: requestId,
          p_implementation_manager_id: user.id
        });

      if (error) throw error;

      // Update UI
      setPendingIMRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: 'Request Acknowledged',
        description: 'The request has been successfully acknowledged.',
      });
      
      await fetchRequests();
    } catch (error) {
      console.error('Error acknowledging request:', error);
      toast({
        title: 'Error',
        description: 'Failed to acknowledge the request.',
        variant: 'destructive'
      });
    }
  };

  const approvePMRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .rpc('approve_request_pm', {
          p_request_id: requestId,
          p_project_manager_id: user.id
        });

      if (error) throw error;

      // Update UI
      setPendingPMRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: 'Request Approved',
        description: 'The request has been successfully approved.',
      });
      
      await fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the request.',
        variant: 'destructive'
      });
    }
  };

  const approveFinanceRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .rpc('approve_request_finance', {
          p_request_id: requestId,
          p_finance_manager_id: user.id
        });

      if (error) throw error;

      // Update UI
      setPendingFinanceRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: 'Request Approved',
        description: 'The request has been successfully approved.',
      });
      
      await fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the request.',
        variant: 'destructive'
      });
    }
  };

  const refreshRequests = async () => {
    await fetchRequests();
  };

  const value = {
    pendingIMRequests,
    pendingPMRequests,
    pendingFinanceRequests,
    approvedRequests,
    loadingRequests,
    acknowledgeRequest,
    approvePMRequest,
    approveFinanceRequest,
    refreshRequests
  };

  return (
    <RequestWorkflowContext.Provider value={value}>
      {children}
    </RequestWorkflowContext.Provider>
  );
}

export const useRequestWorkflow = () => {
  const context = useContext(RequestWorkflowContext);
  if (context === undefined) {
    throw new Error('useRequestWorkflow must be used within a RequestWorkflowProvider');
  }
  return context;
};
