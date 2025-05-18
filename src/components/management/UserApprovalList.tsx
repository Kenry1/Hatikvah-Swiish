
import React, { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client'; // Remove Supabase import
import { db } from '@/integrations/firebase/firebase'; // Import Firestore
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { Profile } from '@/types/onboarding';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge"; // Corrected import path
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { serverTimestamp } from 'firebase/firestore';

interface UserApprovalListProps {
  departmentFilter: string;
}

const UserApprovalList = ({ departmentFilter }: UserApprovalListProps) => {
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPendingUsers();
  }, [departmentFilter]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const profilesRef = collection(db, 'profiles');
      let q = query(profilesRef, where('approval_pending', '==', true));
      
      // Apply department filter if it's not 'all'
      if (departmentFilter !== 'all' && departmentFilter) {
        q = query(q, where('department', '==', departmentFilter));
      }
      
      const querySnapshot = await getDocs(q);
      
      // Transform the data to ensure all required properties are present and map Firestore Timestamps
      const transformedData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          role: data.role,
          department: data.department || null,
          first_name: data.first_name || null,
          last_name: data.last_name || null,
          position: data.position || null,
          hire_date: data.hire_date || null,
          onboarding_completed: data.onboarding_completed || false,
          onboarding_step: data.onboarding_step || 0,
          avatar_url: data.avatar_url || null,
          created_at: data.created_at?.toDate()?.toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate()?.toISOString() || new Date().toISOString(),
          // Create name property from first_name and last_name
          name: data.first_name && data.last_name 
            ? `${data.first_name} ${data.last_name}` 
            : (data.first_name || data.last_name || 'Unknown User')
        };
      }) as Profile[];
      
      setPendingUsers(transformedData);
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Fetch Failed",
        description: error.message || "Failed to fetch pending users.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      // Update the user profile in Firestore
      const userRef = doc(db, 'profiles', userId);
      await updateDoc(userRef, {
        approved: true,
        approval_pending: false,
        updated_at: serverTimestamp(), // Update timestamp
      });
      
      // Refresh the user list
      fetchPendingUsers();
      
      // Show success toast
      toast({
        title: "User Approved",
        description: "User has been approved and can now login to the system.",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      // Update the user profile in Firestore
      const userRef = doc(db, 'profiles', userId);
      await updateDoc(userRef, {
        approved: false,
        approval_pending: false,
        updated_at: serverTimestamp(), // Update timestamp
      });
      
      // Refresh the user list
      fetchPendingUsers();
      
      // Show success toast
      toast({
        title: "User Rejected",
        description: "User has been rejected.",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Rejection Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending User Approvals</CardTitle>
        <CardDescription>Approve or reject new user registrations.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : pendingUsers.length > 0 ? (
          <Table>
            <TableCaption>A list of users awaiting approval.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || undefined} alt={user.name || 'User Avatar'} />
                        <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.department || 'Unassigned'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleApproveUser(user.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectUser(user.id)}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No pending user approvals.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserApprovalList;
