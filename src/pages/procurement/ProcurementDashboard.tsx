import React, { useState } from 'react';
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { ShoppingCart, Package, Clock, History, Briefcase, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useProcurement } from '@/contexts/ProcurementContext';
import PendingRequestsTable from '@/components/procurement/PendingRequestsTable';
import PurchaseHistoryTable from '@/components/procurement/PurchaseHistoryTable';
import PurchaseRequestForm from '@/components/procurement/PurchaseRequestForm';
import RequestDetailsDialog from '@/components/procurement/RequestDetailsDialog';
import SupplierDirectory from '@/components/procurement/SupplierDirectory';
import OrderTrackingSection from '@/components/procurement/OrderTrackingSection';
import { PurchaseRequest } from '@/types';
import { ProcurementSidebar } from '@/components/procurement/ProcurementSidebar';

const ProcurementDashboard = () => {
  const { user } = useAuth();
  const { 
    purchaseRequests, 
    suppliers, 
    addPurchaseRequest, 
    approvePurchaseRequest, 
    rejectPurchaseRequest,
    getPendingRequests, 
    getProcessedRequests 
  } = useProcurement();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  
  const isProcurement = user?.role === 'procurement';
  const isManagement = user?.role === 'management';
  const isIT = user?.role === 'it';
  
  const canViewHistory = isProcurement || isManagement || isIT;
  const canCreateRequest = isProcurement;
  const canManageRequests = isProcurement;
  
  const handleViewRequest = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setDetailsDialogOpen(true);
  };
  
  const handleApproveRequest = (id: string) => {
    approvePurchaseRequest(id);
  };
  
  const handleRejectRequest = (id: string) => {
    rejectPurchaseRequest(id);
  };

  return (
    <RoleDashboardLayout 
      pageTitle="Procurement"
      roleLabel="Procurement"
      dashboardDescription="Manage purchase requests and track orders"
      sidebar={<ProcurementSidebar />}
    >
      <div className="mb-6">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="track">Track Order</TabsTrigger>
              {canViewHistory && <TabsTrigger value="history">Purchase History</TabsTrigger>}
              {isProcurement && <TabsTrigger value="suppliers">Supplier Directory</TabsTrigger>}
            </TabsList>
            
            {canCreateRequest && (
              <Button onClick={() => setFormDialogOpen(true)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create Purchase Request
              </Button>
            )}
          </div>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{purchaseRequests.length}</div>
                  <p className="text-xs text-muted-foreground">+{getPendingRequests().length} pending</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getPendingRequests().length}</div>
                  <p className="text-xs text-muted-foreground">
                    {getPendingRequests().length > 0 ? "Waiting for review" : "No pending requests"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {purchaseRequests.filter(req => req.status === 'approved' || req.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Approved purchases</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.length}</div>
                  <p className="text-xs text-muted-foreground">Approved suppliers</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Pending Requests</h3>
              <PendingRequestsTable
                requests={getPendingRequests()}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
                onView={handleViewRequest}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="track">
            <Card>
              <CardHeader>
                <CardTitle>Track Purchase Request</CardTitle>
                <CardDescription>Enter a request ID to track its status</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderTrackingSection requests={purchaseRequests} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {canViewHistory && (
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>View all processed purchase requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <PurchaseHistoryTable
                    requests={getProcessedRequests()}
                    onView={handleViewRequest}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {isProcurement && (
            <TabsContent value="suppliers">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Directory</CardTitle>
                  <CardDescription>List of approved suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <SupplierDirectory suppliers={suppliers} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      {/* Dialogs */}
      <PurchaseRequestForm
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={addPurchaseRequest}
      />
      
      <RequestDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        request={selectedRequest}
        onApprove={canManageRequests ? handleApproveRequest : undefined}
        onReject={canManageRequests ? handleRejectRequest : undefined}
      />
    </RoleDashboardLayout>
  );
};

export default ProcurementDashboard;
