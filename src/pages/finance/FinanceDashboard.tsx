
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { FinanceSidebar } from '@/components/finance/FinanceSidebar';

const FinanceDashboard = () => {
  const newFeatures = [
    {
      title: "Budget Tracking",
      description: "Monitor project and department budgets and expenditures."
    },
    {
      title: "Expense Approvals",
      description: "Review and approve expense reports and purchase requests."
    },
    {
      title: "Financial Reporting",
      description: "Generate and analyze financial reports and forecasts."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Finance Dashboard"
      roleLabel="Finance"
      dashboardDescription="Manage budgets, expenses, and financial reporting."
      newFeatures={newFeatures}
      sidebar={<FinanceSidebar />}
    />
  );
};

export default FinanceDashboard;
