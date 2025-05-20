import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
// import { supabase } from '@/integrations/supabase/client'; // Remove Supabase import
import { db } from '@/integrations/firebase/firebase'; // Import Firestore from your Firebase setup
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import necessary Firestore functions
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
  finance_manager_first_name: string | null;
  finance_manager_last_name: string | null;
  submitter_first_name: string | null;
  submitter_last_name: string | null;
  submitter_department: string | null;
  implementation_manager_first_name: string | null;
  implementation_manager_last_name: string | null;
  project_manager_first_name: string | null;
  project_manager_last_name: string | null;
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

  // Fetch all request types based on user role - Removed user dependency
  useEffect(() => {
    // Requests will now be fetched when refreshRequests is called
    // fetchRequests(); 
  }, []); // Empty dependency array ensures this runs only once on mount

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);

      // Get user role from Firebase (assuming a 'profiles' collection)
      if (!user?.uid) {
        setLoadingRequests(false);
        return;
      }
      const profilesRef = collection(db, 'profiles');
      const q = query(profilesRef, where('id', '==', user.uid)); // Assuming 'id' field matches Firebase Auth UID
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('No profile found for user:', user.uid);
        setLoadingRequests(false);
        return;
      }

      const profileData = querySnapshot.docs[0].data();
      const userRole = profileData?.role;
      
      // Based on role, fetch appropriate requests from Firebase
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
    // TODO: Implement fetching pending IM requests from Firebase
    console.log('Fetching pending IM requests from Firebase...');
    // Replace with your Firebase Firestore query logic
    // Example: const q = query(collection(db, 'requests'), where('status', '==', 'pending_im'));
    // const querySnapshot = await getDocs(q);
    // const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // setPendingIMRequests(data as RequestReport[]);
  };

  const fetchPendingPMRequests = async () => {
    // TODO: Implement fetching pending PM requests from Firebase
    console.log('Fetching pending PM requests from Firebase...');
    // Replace with your Firebase Firestore query logic
  };

  const fetchPendingFinanceRequests = async () => {
    // TODO: Implement fetching pending Finance requests from Firebase
    console.log('Fetching pending Finance requests from Firebase...');
    // Replace with your Firebase Firestore query logic
  };

  const fetchApprovedRequests = async () => {
    // TODO: Implement fetching approved requests for Logistics from Firebase
    console.log('Fetching approved requests from Firebase...');
    // Replace with your Firebase Firestore query logic
  };

  const acknowledgeRequest = async (requestId: string) => {
    if (!user) return;

    try {
      // TODO: Implement acknowledging request in Firebase
      console.log(`Acknowledging request ${requestId} in Firebase...`);
      // Replace with your Firebase Firestore update logic
      // Example: await updateDoc(doc(db, 'requests', requestId), { im_acknowledged_at: new Date(), request_status: 'acknowledged' });

      // Assuming the update was successful, update UI
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
      // TODO: Implement approving PM request in Firebase
      console.log(`Approving PM request ${requestId} in Firebase...`);
      // Replace with your Firebase Firestore update logic
      // Example: await updateDoc(doc(db, 'requests', requestId), { pm_approved_at: new Date(), request_status: 'pm_approved' });

      // Assuming the update was successful, update UI
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
      // TODO: Implement approving Finance request in Firebase
      console.log(`Approving Finance request ${requestId} in Firebase...`);
      // Replace with your Firebase Firestore update logic
      // Example: await updateDoc(doc(db, 'requests', requestId), { finance_approved_at: new Date(), request_status: 'finance_approved' });

      // Assuming the update was successful, update UI
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
