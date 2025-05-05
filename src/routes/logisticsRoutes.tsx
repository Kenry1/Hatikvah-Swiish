
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogisticsDashboard from '@/pages/logistics/LogisticsDashboard';
import LogisticsVehicles from '@/pages/logistics/Vehicles';
import LogisticsFuelRequests from '@/pages/logistics/FuelRequests';
import AddVehicle from '@/pages/logistics/AddVehicle';
import AssignVehicle from '@/pages/logistics/AssignVehicle';
import LogisticsManageAccount from '@/pages/logistics/ManageAccount';

export const logisticsRoutes: RouteObject[] = [
  {
    path: '/logistics',
    element: (
      <ProtectedRoute allowedRoles={['logistics']}>
        <LogisticsDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/logistics/vehicles',
    element: (
      <ProtectedRoute allowedRoles={['logistics']}>
        <LogisticsVehicles />
      </ProtectedRoute>
    )
  },
  {
    path: '/logistics/fuel-requests',
    element: (
      <ProtectedRoute allowedRoles={['logistics']}>
        <LogisticsFuelRequests />
      </ProtectedRoute>
    )
  },
  {
    path: '/logistics/vehicles/new',
    element: (
      <ProtectedRoute allowedRoles={['logistics']}>
        <AddVehicle />
      </ProtectedRoute>
    )
  },
  {
    path: '/logistics/vehicles/assign',
    element: (
      <ProtectedRoute allowedRoles={['logistics']}>
        <AssignVehicle />
      </ProtectedRoute>
    )
  },
  {
    path: '/logistics/manage-account',
    element: (
      <ProtectedRoute allowedRoles={['logistics']}>
        <LogisticsManageAccount />
      </ProtectedRoute>
    )
  }
];
