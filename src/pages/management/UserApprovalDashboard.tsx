
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { ManagementSidebar } from '@/components/management/ManagementSidebar';
import UserApprovalList from '@/components/management/UserApprovalList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck } from 'lucide-react';

const UserApprovalDashboard = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  const departments = [
    'engineering', 
    'marketing', 
    'sales', 
    'hr', 
    'operations', 
    'finance', 
    'it', 
    'warehouse', 
    'logistics', 
    'ehs', 
    'management', 
    'planning', 
    'procurement'
  ];

  return (
    <RoleDashboardLayout
      pageTitle="User Management"
      roleLabel="Management"
      dashboardDescription="Approve and manage user access to the system"
      sidebar={<ManagementSidebar />}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              User Approval Dashboard
            </CardTitle>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">Department:</span>
              <Select
                value={departmentFilter}
                onValueChange={(value) => setDepartmentFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <UserApprovalList departmentFilter={departmentFilter} />
          </CardContent>
        </Card>
      </div>
    </RoleDashboardLayout>
  );
};

export default UserApprovalDashboard;
