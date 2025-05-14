
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ManagementDashboard from '@/pages/management/ManagementDashboard';
import UserApprovalDashboard from '@/pages/management/UserApprovalDashboard';

export const managementRoutes: RouteObject[] = [
  {
    path: '/management',
    element: (
      <ProtectedRoute allowedRoles={['management']}>
        <ManagementDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/management/user-approval',
    element: (
      <ProtectedRoute allowedRoles={['management']}>
        <UserApprovalDashboard />
      </ProtectedRoute>
    )
  }
];
