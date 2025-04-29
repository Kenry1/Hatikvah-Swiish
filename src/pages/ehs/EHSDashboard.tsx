
import RoleDashboardLayout from '@/components/RoleDashboardLayout';

const EHSDashboard = () => {
  const newFeatures = [
    {
      title: "Safety Compliance",
      description: "Track compliance with safety regulations and standards."
    },
    {
      title: "Incident Reports",
      description: "Monitor and manage workplace incidents and reports."
    },
    {
      title: "Equipment Inspections",
      description: "Schedule and track safety inspections for equipment and facilities."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="EHS Dashboard"
      roleLabel="EHS"
      dashboardDescription="Manage environmental, health, and safety compliance."
      newFeatures={newFeatures}
    />
  );
};

export default EHSDashboard;
