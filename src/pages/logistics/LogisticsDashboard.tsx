
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Fuel, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogisticsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
          <Card>
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
          
          <Card>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Car className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Toyota Hilux (KBC 123D)</p>
                      <p className="text-xs text-muted-foreground">Assigned to Alex Technician • 2 hours ago</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/logistics/vehicles')}
                  >
                    View
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <Fuel className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fuel Request Approved</p>
                      <p className="text-xs text-muted-foreground">For Ford Ranger (KDD 456P) • 5 hours ago</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/logistics/fuel-requests')}
                  >
                    Details
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Maintenance Alert</p>
                      <p className="text-xs text-muted-foreground">Isuzu D-Max (KCA 789Q) • Yesterday</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/logistics/vehicles')}
                  >
                    Schedule
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/logistics/vehicles')}
                >
                  View All Vehicles
                </Button>
              </div>
            </CardContent>
          </Card>
          
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
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;
