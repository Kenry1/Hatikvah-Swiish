
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Package, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WarehouseDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'Warehouse User'}</h1>
          <p className="text-muted-foreground">
            Monitor material requests, inventory levels, and manage company assets.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Requests
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Ready to issue
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Require reordering
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inventory
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Across 24 categories
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Material Requests</CardTitle>
              <CardDescription>Overview of the latest requests from technicians</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cable Installation Kit</p>
                      <p className="text-xs text-muted-foreground">Alex Technician • 2 hours ago</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/warehouse/material-requests')}
                  >
                    Review
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fiber Optic Tools</p>
                      <p className="text-xs text-muted-foreground">Jane Technician • 5 hours ago</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/warehouse/material-requests')}
                  >
                    Review
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Safety Equipment</p>
                      <p className="text-xs text-muted-foreground">Mark Technician • Yesterday</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/warehouse/material-requests')}
                  >
                    Review
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/warehouse/material-requests')}
                >
                  View All Requests
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
                onClick={() => navigate('/warehouse/inventory')}
              >
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
              <Button 
                className="w-full justify-start"
                onClick={() => navigate('/warehouse/assets')}
              >
                <Package className="mr-2 h-4 w-4" />
                Manage Company Assets
              </Button>
              <Button 
                className="w-full justify-start"
                onClick={() => navigate('/warehouse/material-requests')}
              >
                <Package className="mr-2 h-4 w-4" />
                Review Material Requests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WarehouseDashboard;
