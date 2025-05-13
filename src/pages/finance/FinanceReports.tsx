
import DashboardLayout from '@/components/DashboardLayout';
import { FinanceSidebar } from '@/components/finance/FinanceSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApprovedRequestsReport from '@/components/logistics/ApprovedRequestsReport';
import { BadgeDollarSign, FileBarChart, PieChart } from 'lucide-react';

const FinanceReports = () => {
  return (
    <DashboardLayout sidebar={<FinanceSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance Reports</h1>
          <p className="text-muted-foreground">
            View and analyze financial data and approved requests.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Budget Reports</CardTitle>
              <FileBarChart className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Monthly budget reports available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Expense Reports</CardTitle>
              <PieChart className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Approved expense reports</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
              <BadgeDollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Recently approved requests</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="approved-requests">
          <TabsList>
            <TabsTrigger value="approved-requests">Approved Requests</TabsTrigger>
            <TabsTrigger value="budget-reports">Budget Reports</TabsTrigger>
            <TabsTrigger value="expense-analysis">Expense Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="approved-requests" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Approved Requests Report</CardTitle>
                <CardDescription>Review all requests that have completed the approval workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <ApprovedRequestsReport />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="budget-reports" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Reports</CardTitle>
                <CardDescription>Monthly and quarterly budget reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-4 text-center text-muted-foreground">Budget report data will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expense-analysis" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
                <CardDescription>Detailed breakdown of expenses by department and category</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-4 text-center text-muted-foreground">Expense analysis data will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinanceReports;
