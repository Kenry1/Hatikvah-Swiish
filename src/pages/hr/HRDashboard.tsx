
import RoleDashboardLayout from '@/components/RoleDashboardLayout';

const HRDashboard = () => {
  const newFeatures = [
    {
      title: "Employee Management",
      description: "Add, edit, and manage employee profiles and records."
    },
    {
      title: "Recruitment",
      description: "Track job postings, applications, and hiring processes."
    },
    {
      title: "Performance Reviews",
      description: "Schedule and manage employee performance evaluations."
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="HR Dashboard"
      roleLabel="HR"
      dashboardDescription="Manage employee records, recruitment, and company policies."
      newFeatures={newFeatures}
    />
  );
};

export default HRDashboard;
