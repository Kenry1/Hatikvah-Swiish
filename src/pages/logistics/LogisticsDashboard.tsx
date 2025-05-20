
import React, { useEffect } from 'react';
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FuelRequestsOverview } from '@/components/logistics/FuelRequestsOverview';
import ApprovedRequestsReport from '@/components/logistics/ApprovedRequestsReport';
import { Fuel, Truck, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRequestWorkflow } from '@/contexts/RequestWorkflowContext'; // Import the context hook
import { useAuth } from '@/contexts/AuthContext'; // Import AuthContext

const LogisticsDashboard = () => {
  const navigate = useNavigate();
  const { refreshRequests } = useRequestWorkflow(); // Use the context hook
  const { user } = useAuth(); // Use AuthContext

  // Fetch requests when the component mounts and user is available
  useEffect(() => {
    if (user) {
      refreshRequests();
    }
  }, [user, refreshRequests]); // Add user and refreshRequests as dependencies
  
  const quickStats = [
    {
      title: "Available Vehicles",
      value: "12",
      icon: <Truck className="h-5 w-5 text-blue-600" />,
      onClick: () => navigate('/logistics/vehicles')
    },
    {
      title: "Pending Fuel Requests",
      value: "8",
      icon: <Fuel className="h-5 w-5 text-amber-600" />,
      onClick: () => navigate('/logistics/fuel-requests')
    },
    {
      title: "Material Deliveries",
      value: "4",
      icon: <Package className="h-5 w-5 text-green-600" />
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Logistics Dashboard"
      roleLabel="Logistics"
      dashboardDescription="Manage vehicles, fuel requests, and equipment delivery."
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {quickStats.map((stat, index) => (
            <Card 
              key={index} 
              className={stat.onClick ? "cursor-pointer hover:shadow-md transition-all" : ""}
              onClick={stat.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="approved-requests">
          <TabsList>
            <TabsTrigger value="fuel-requests">Fuel Requests</TabsTrigger>
            <TabsTrigger value="approved-requests">Approved Requests Report</TabsTrigger>
          </TabsList>
          <TabsContent value="fuel-requests" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-semibold mb-4">Recent Fuel Requests</h3>
            <FuelRequestsOverview />
          </TabsContent>
          <TabsContent value="approved-requests" className="mt-2">
            <ApprovedRequestsReport />
          </TabsContent>
        </Tabs>
      </div>
    </RoleDashboardLayout>
  );
};

export default LogisticsDashboard;
