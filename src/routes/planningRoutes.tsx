
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PlanningDashboard from '@/pages/planning/PlanningDashboard';

export const planningRoutes: RouteObject[] = [
  {
    path: '/planning',
    element: (
      <ProtectedRoute allowedRoles={['planning']}>
        <PlanningDashboard />
      </ProtectedRoute>
    )
  }
];
