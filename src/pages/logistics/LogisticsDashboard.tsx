
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Fuel, AlertCircle, CheckCircle, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VehiclesOverview } from '@/components/logistics/VehiclesOverview';
import { FuelRequestsOverview } from '@/components/logistics/FuelRequestsOverview';
import { useTheme } from '@/contexts/ThemeContext';

const LogisticsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'Logistics User'}</h1>
          <p className="text-muted-foreground">
            Manage fleet vehicles, fuel requests, and vehicle assignments from here.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate('/logistics/vehicles')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vehicles
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                18 assigned, 6 available
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate('/logistics/fuel-requests')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Fuel Requests
              </CardTitle>
              <Fuel className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Maintenance Due
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Within the next 7 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Assignments
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Vehicle Activities</CardTitle>
              <CardDescription>Latest assignments and status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <VehiclesOverview />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Fuel Requests</CardTitle>
              <CardDescription>Latest fuel requests from employees</CardDescription>
            </CardHeader>
            <CardContent>
              <FuelRequestsOverview />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start"
                onClick={() => navigate('/logistics/vehicles/new')}
              >
                <Car className="mr-2 h-4 w-4" />
                Add New Vehicle
              </Button>
              <Button 
                className="w-full justify-start"
                onClick={() => navigate('/logistics/vehicles/assign')}
              >
                <Car className="mr-2 h-4 w-4" />
                Assign Vehicle
              </Button>
              <Button 
                className="w-full justify-start"
                onClick={() => navigate('/logistics/fuel-requests')}
              >
                <Fuel className="mr-2 h-4 w-4" />
                Manage Fuel Requests
              </Button>
              <Button 
                className="w-full justify-start"
                onClick={() => navigate('/logistics/reports')}
              >
                <PieChart className="mr-2 h-4 w-4" />
                View Fleet Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;
