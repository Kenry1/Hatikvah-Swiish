
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ManagementDashboard from '@/pages/management/ManagementDashboard';

export const managementRoutes: RouteObject[] = [
  {
    path: '/management',
    element: (
      <ProtectedRoute allowedRoles={['management']}>
        <ManagementDashboard />
      </ProtectedRoute>
    )
  }
];
