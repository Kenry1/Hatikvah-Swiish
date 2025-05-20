
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ITDashboard from '@/components/it/dashboard';

export const itRoutes: RouteObject[] = [
  {
    path: '/it',
    element: (
      <ProtectedRoute allowedRoles={['it']}>
        <ITDashboard />
      </ProtectedRoute>
    )
  }
];
