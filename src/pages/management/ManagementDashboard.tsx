
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { ManagementSidebar } from '@/components/management/ManagementSidebar';

const ManagementDashboard = () => {
  const newFeatures = [
    {
      title: "Performance Overview",
      description: "View company-wide performance metrics and KPIs."
    },
    {
      title: "Department Management",
      description: "Monitor and coordinate across all departments."
    },
    {
      title: "Strategic Planning",
      description: "Develop and track strategic initiatives and goals."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Management Dashboard"
      roleLabel="Management"
      dashboardDescription="Oversee company operations and strategic direction."
      newFeatures={newFeatures}
      sidebar={<ManagementSidebar />}
    />
  );
};

export default ManagementDashboard;
