
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

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
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('approval_pending', true);
      
      // Apply department filter if it's not 'all'
      if (departmentFilter !== 'all' && departmentFilter) {
        query = query.eq('department', departmentFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to ensure all required properties are present
      const transformedData = data.map(user => ({
        ...user,
        // Create name property from first_name and last_name
        name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : (user.first_name || user.last_name || 'Unknown User')
      })) as Profile[];
      
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
      // Update the user profile
      const { error } = await supabase
        .from('profiles')
        .update({
          approved: true,
          approval_pending: false
        })
        .eq('id', userId);
      
      if (error) throw error;
      
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
      // Update the user profile
      const { error } = await supabase
        .from('profiles')
        .update({
          approved: false,
          approval_pending: false
        })
        .eq('id', userId);
      
      if (error) throw error;
      
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
