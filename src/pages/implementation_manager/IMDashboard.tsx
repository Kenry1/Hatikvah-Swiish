
import RoleDashboardLayout from '@/components/RoleDashboardLayout';

const IMDashboard = () => {
  const newFeatures = [
    {
      title: "Implementation Projects",
      description: "Track and manage implementation project statuses and timelines."
    },
    {
      title: "Request Acknowledgments",
      description: "Review and acknowledge resource requests before PM approval."
    },
    {
      title: "Resource Allocation",
      description: "Assign and manage resources for implementation projects."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Implementation Manager Dashboard"
      roleLabel="Implementation Manager"
      dashboardDescription="Oversee implementation projects and resource allocation."
      newFeatures={newFeatures}
    />
  );
};

export default IMDashboard;
