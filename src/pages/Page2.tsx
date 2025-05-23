import React, { useEffect } from 'react';
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import PendingFinanceApprovals from '@/components/finance/PendingFinanceApprovals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, FileText } from 'lucide-react';
import { useRequestWorkflow } from '@/contexts/RequestWorkflowContext'; // Import the context hook
import { useAuth } from '@/contexts/AuthContext'; // Import AuthContext
import { FinanceSidebar } from '@/components/finance/FinanceSidebar';

const Page2 = () => {
  const { refreshRequests } = useRequestWorkflow(); // Use the context hook
  const { user } = useAuth(); // Use AuthContext

  // Fetch requests when the component mounts and user is available
  useEffect(() => {
    if (user) {
      refreshRequests();
    }
  }, [user, refreshRequests]); // Add user and refreshRequests as dependencies

  const summaryItems = [
    {
      title: "Budget Allocation",
      value: "$1,245,600",
      change: "+5.4%",
      icon: <DollarSign className="h-5 w-5 text-green-600" />
    },
    {
      title: "Project Expenses",
      value: "$876,240",
      change: "+2.1%",
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Pending Approvals",
      value: "8", // This should ideally be dynamic based on fetched data
      change: "-3", // This should ideally be dynamic based on fetched data
      icon: <FileText className="h-5 w-5 text-amber-600" />
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Finance Dashboard"
      roleLabel="Finance"
      dashboardDescription="Manage budgets, expenses, and financial reporting."
      sidebar={<FinanceSidebar />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {summaryItems.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className={`text-xs ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change} from previous period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Add the pending finance approvals component */}
        <PendingFinanceApprovals />
      </div>
    </RoleDashboardLayout>
  );
}

export default Page2;
