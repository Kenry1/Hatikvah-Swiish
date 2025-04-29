
import RoleDashboardLayout from '@/components/RoleDashboardLayout';

const PlanningDashboard = () => {
  const newFeatures = [
    {
      title: "Resource Planning",
      description: "Plan and allocate resources across projects and teams."
    },
    {
      title: "Vehicle Management",
      description: "Manage and track vehicle assignments and availability."
    },
    {
      title: "Schedule Optimization",
      description: "Optimize schedules for technicians and equipment usage."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Planning Dashboard"
      roleLabel="Planning"
      dashboardDescription="Optimize resource allocation and project scheduling."
      newFeatures={newFeatures}
    />
  );
};

export default PlanningDashboard;
