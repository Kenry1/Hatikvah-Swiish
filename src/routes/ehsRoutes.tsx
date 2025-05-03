
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import EHSDashboard from '@/pages/ehs/EHSDashboard';
import EHSOverview from '@/pages/ehs/EHSOverview';

export const ehsRoutes: RouteObject[] = [
  {
    path: '/ehs',
    element: (
      <ProtectedRoute allowedRoles={['ehs']}>
        <EHSDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/ehs/overview',
    element: (
      <ProtectedRoute allowedRoles={['ehs']}>
        <EHSOverview />
      </ProtectedRoute>
    )
  }
];
