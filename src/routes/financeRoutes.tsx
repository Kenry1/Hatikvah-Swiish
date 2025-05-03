
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import FinanceDashboard from '@/pages/finance/FinanceDashboard';

export const financeRoutes: RouteObject[] = [
  {
    path: '/finance',
    element: (
      <ProtectedRoute allowedRoles={['finance']}>
        <FinanceDashboard />
      </ProtectedRoute>
    )
  }
];
