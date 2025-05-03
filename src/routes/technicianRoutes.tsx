
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import TechnicianDashboard from '@/pages/technician/TechnicianDashboard';
import FuelRequests from '@/pages/technician/FuelRequests';
import MaterialRequests from '@/pages/technician/MaterialRequests';
import Vehicles from '@/pages/technician/Vehicles';
import SafetyEquipment from '@/pages/technician/SafetyEquipment';

export const technicianRoutes: RouteObject[] = [
  {
    path: '/technician',
    element: (
      <ProtectedRoute allowedRoles={['technician']}>
        <TechnicianDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/technician/fuel-requests',
    element: (
      <ProtectedRoute allowedRoles={['technician']}>
        <FuelRequests />
      </ProtectedRoute>
    )
  },
  {
    path: '/technician/material-requests',
    element: (
      <ProtectedRoute allowedRoles={['technician']}>
        <MaterialRequests />
      </ProtectedRoute>
    )
  },
  {
    path: '/technician/vehicles',
    element: (
      <ProtectedRoute allowedRoles={['technician']}>
        <Vehicles />
      </ProtectedRoute>
    )
  },
  {
    path: '/technician/safety-equipment',
    element: (
      <ProtectedRoute allowedRoles={['technician']}>
        <SafetyEquipment />
      </ProtectedRoute>
    )
  }
];
