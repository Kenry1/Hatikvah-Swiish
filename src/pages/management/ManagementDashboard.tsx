
import RoleDashboardLayout from '@/components/RoleDashboardLayout';

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
    />
  );
};

export default ManagementDashboard;
