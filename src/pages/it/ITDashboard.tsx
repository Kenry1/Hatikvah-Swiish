
import RoleDashboardLayout from '@/components/RoleDashboardLayout';

const ITDashboard = () => {
  const newFeatures = [
    {
      title: "System Access",
      description: "Manage user permissions and system access controls."
    },
    {
      title: "Technical Support",
      description: "Track and resolve technical support tickets and requests."
    },
    {
      title: "Equipment Management",
      description: "Inventory and manage IT equipment and software licenses."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="IT Dashboard"
      roleLabel="IT"
      dashboardDescription="Manage systems, support tickets, and equipment."
      newFeatures={newFeatures}
    />
  );
};

export default ITDashboard;
