import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Fuel, Car, Package, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TechnicianSidebar } from '@/components/technician/TechnicianSidebar';
import { SidebarInset } from '@/components/ui/sidebar';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout sidebar={<TechnicianSidebar />}>
      <SidebarInset>
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'Technician'}</h1>
            <p className="text-muted-foreground">
              Manage your fuel requests, vehicle status, and material requests all in one place.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fuel Requests
                </CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  2 pending, 1 approved
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate('/technician/fuel-requests')}
                >
                  View Requests
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assigned Vehicle
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Toyota Hilux</div>
                <p className="text-xs text-muted-foreground">
                  Registration: KBZ 123A
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate('/technician/vehicles')}
                >
                  Manage Vehicle
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Material Requests
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  3 pending, 2 approved
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate('/technician/material-requests')}
                >
                  View Materials
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Safety Equipment
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Safety First</div>
                <p className="text-xs text-muted-foreground">
                  Request safety equipment
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate('/technician/safety-equipment')}
                >
                  Request Equipment
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button 
                  className="justify-start"
                  onClick={() => navigate('/technician/fuel-requests')}
                >
                  <Fuel className="mr-2 h-4 w-4" />
                  New Fuel Request
                </Button>
                <Button 
                  className="justify-start"
                  onClick={() => navigate('/technician/material-requests')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  New Material Request
                </Button>
                <Button 
                  className="justify-start"
                  onClick={() => navigate('/technician/vehicles')}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Manage Vehicle
                </Button>
                <Button 
                  className="justify-start"
                  onClick={() => navigate('/technician/safety-equipment')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Request Safety Equipment
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Fuel request approved
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Material request pending
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Yesterday
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Vehicle assigned to you
                      </p>
                      <p className="text-sm text-muted-foreground">
                        3 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
