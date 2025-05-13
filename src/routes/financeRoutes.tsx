
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import FinanceDashboard from '@/pages/finance/FinanceDashboard';
import FinanceReports from '@/pages/finance/FinanceReports';

export const financeRoutes: RouteObject[] = [
  {
    path: '/finance',
    element: (
      <ProtectedRoute allowedRoles={['finance']}>
        <FinanceDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/finance/reports',
    element: (
      <ProtectedRoute allowedRoles={['finance']}>
        <FinanceReports />
      </ProtectedRoute>
    )
  }
];
