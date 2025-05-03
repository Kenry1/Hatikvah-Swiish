
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PerformanceGraphs } from '@/components/hr/PerformanceGraphs';
import { LeaveApplicationForm } from '@/components/hr/LeaveApplicationForm';
import { FieldTripApplicationForm } from '@/components/hr/FieldTripApplicationForm';
import { AIInsights } from '@/components/hr/AIInsights';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Manage employee records, recruitment, and company policies.
          </p>
        </div>

        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <AIInsights />
            <PerformanceGraphs />
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Application</CardTitle>
                  <CardDescription>Submit a leave application request</CardDescription>
                </CardHeader>
                <CardContent>
                  <LeaveApplicationForm />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Field Trip Application</CardTitle>
                  <CardDescription>Submit a field trip application request</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldTripApplicationForm />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="employees">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Employees</CardTitle>
                  <CardDescription>Manage company employees and their profiles</CardDescription>
                </div>
                <Button onClick={() => window.location.href = '/hr/employees/new'}>Add New Employee</Button>
              </CardHeader>
              <CardContent>
                <EmployeesTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const EmployeesTable = () => {
  // This is a temporary placeholder - we'll create a full component for this
  return (
    <div className="py-4">
      <p>Employee listing will appear here. Click "Add New Employee" to create a new employee.</p>
      <p className="text-muted-foreground mt-2">
        <a href="/hr/employees" className="hover:underline text-primary">View all employees</a>
      </p>
    </div>
  );
};

export default HRDashboard;
