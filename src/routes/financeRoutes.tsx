import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
// import FinanceDashboard from '@/pages/finance/FinanceDashboard'; // Removed FinanceDashboard import
import FinanceReports from '@/pages/finance/FinanceReports';
import Page2 from '@/pages/Page2'; // Import the new Page2 component

export const financeRoutes: RouteObject[] = [
  {
    path: '/finance',
    element: (
      <ProtectedRoute allowedRoles={['finance']}>
        <Page2 /> {/* Render Page2 for the /finance route */}
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
