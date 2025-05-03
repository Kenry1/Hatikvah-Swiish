
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import IMDashboard from '@/pages/implementation_manager/IMDashboard';
import EHSRequests from '@/pages/implementation_manager/EHSRequests';

export const implementationManagerRoutes: RouteObject[] = [
  {
    path: '/implementation-manager',
    element: (
      <ProtectedRoute allowedRoles={['implementation_manager']}>
        <IMDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/implementation-manager/ehs-requests',
    element: (
      <ProtectedRoute allowedRoles={['implementation_manager']}>
        <EHSRequests />
      </ProtectedRoute>
    )
  }
];
