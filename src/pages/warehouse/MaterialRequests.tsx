
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const MaterialRequests = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Manage Material Requests</h1>
      <p className="mt-2 text-muted-foreground">Review, approve, and issue materials requested by technicians.</p>
    </DashboardLayout>
  );
};

export default MaterialRequests;
