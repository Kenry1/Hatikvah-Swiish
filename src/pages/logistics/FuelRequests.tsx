
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const FuelRequests = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Fuel Request Management</h1>
      <p className="mt-2 text-muted-foreground">Approve and track fuel usage across the fleet.</p>
    </DashboardLayout>
  );
};

export default FuelRequests;
