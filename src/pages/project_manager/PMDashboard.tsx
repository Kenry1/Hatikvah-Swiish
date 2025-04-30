
import RoleDashboardLayout from '@/components/RoleDashboardLayout';

const PMDashboard = () => {
  const newFeatures = [
    {
      title: "Project Overview",
      description: "View and track all current projects and their status."
    },
    {
      title: "Request Approvals",
      description: "Approve requests after acknowledgment by Implementation Managers."
    },
    {
      title: "Task Assignments",
      description: "Assign and monitor tasks across your project teams."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Project Manager Dashboard"
      roleLabel="Project Manager"
      dashboardDescription="Oversee project status, approvals, and team coordination."
      newFeatures={newFeatures}
    />
  );
};

export default PMDashboard;
