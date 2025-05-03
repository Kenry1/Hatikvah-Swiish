
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProcurementDashboard from '@/pages/procurement/ProcurementDashboard';

export const procurementRoutes: RouteObject[] = [
  {
    path: '/procurement',
    element: (
      <ProtectedRoute allowedRoles={['procurement', 'it', 'finance', 'management']}>
        <ProcurementDashboard />
      </ProtectedRoute>
    )
  }
];
