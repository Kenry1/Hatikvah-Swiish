import React from 'react';
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { ManagementSidebar } from '@/components/management/ManagementSidebar';

const One: React.FC = () => {
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
      pageTitle="Management Dashboard - Temporary Redirect"
      roleLabel="Management"
      dashboardDescription="Oversee company operations and strategic direction (Temporary Page 1)."
      newFeatures={newFeatures}
      sidebar={<ManagementSidebar />}
    >
      {/* Content specific to temporary page 1 can go here if needed */}
      <div className="flex items-center justify-center mt-8">
        <p className="text-xl text-gray-700">This is a temporary page for testing the management route.</p>
      </div>
    </RoleDashboardLayout>
  );
};

export default One;