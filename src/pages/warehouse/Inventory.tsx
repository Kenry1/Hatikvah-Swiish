
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const Inventory = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      <p className="mt-2 text-muted-foreground">Manage warehouse inventory and field materials.</p>
    </DashboardLayout>
  );
};

export default Inventory;
