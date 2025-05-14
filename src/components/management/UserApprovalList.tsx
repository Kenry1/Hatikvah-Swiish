
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface UserForApproval {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
  role: string;
  position: string | null;
  approval_pending: boolean;
  approved: boolean;
  created_at: string;
}

interface UserApprovalListProps {
  departmentFilter?: string;
}

const UserApprovalList = ({ departmentFilter }: UserApprovalListProps) => {
  const [users, setUsers] = useState<UserForApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [departmentFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*');
      
      // Apply department filter if provided
      if (departmentFilter && departmentFilter !== 'all') {
        query = query.eq('department', departmentFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setUsers(data as UserForApproval[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: "There was a problem loading the user list.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          approved: true,
          approval_pending: false 
        })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state to reflect changes
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, approved: true, approval_pending: false }
          : user
      ));
      
      toast({
        title: "User approved",
        description: "User can now access the system.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: "Error approving user",
        description: "There was a problem approving the user.",
        variant: "destructive"
      });
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approved: false,
          approval_pending: false
        })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state to reflect changes
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, approved: false, approval_pending: false }
          : user
      ));
      
      toast({
        title: "User rejected",
        description: "User will not be able to access the system.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error rejecting user",
        description: "There was a problem rejecting the user.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter to get pending users for the badge count
  const pendingUsers = users.filter(user => user.approval_pending);
  // Filter to get approved users for management
  const approvedUsers = users.filter(user => user.approved && !user.approval_pending);
  // Filter to get rejected users
  const rejectedUsers = users.filter(user => !user.approved && !user.approval_pending);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span className="flex items-center">
            <UserCheck className="mr-2 h-5 w-5" />
            User Management
          </span>
          {pendingUsers.length > 0 && (
            <Badge variant="destructive">{pendingUsers.length} Pending</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Approve or reject user access to the system based on their department and role
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Users Section */}
            {pendingUsers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Pending Approval</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : 'Unnamed User'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department || 'Not specified'}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm" 
                              variant="default"
                              onClick={() => approveUser(user.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectUser(user.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Approved Users Section */}
            {approvedUsers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Approved Users
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : 'Unnamed User'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department || 'Not specified'}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant="success" className="bg-green-500">Approved</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Rejected Users Section */}
            {rejectedUsers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  Rejected Users
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : 'Unnamed User'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department || 'Not specified'}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Rejected</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserApprovalList;
