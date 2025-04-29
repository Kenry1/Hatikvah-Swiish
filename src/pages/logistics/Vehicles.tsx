
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const Vehicles = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Vehicle Management</h1>
      <p className="mt-2 text-muted-foreground">Manage the company's vehicle fleet.</p>
    </DashboardLayout>
  );
};

export default Vehicles;
