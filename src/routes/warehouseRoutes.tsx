
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import WarehouseDashboard from '@/pages/warehouse/WarehouseDashboard';
import WarehouseMaterialRequests from '@/pages/warehouse/MaterialRequests';
import Inventory from '@/pages/warehouse/Inventory';
import Assets from '@/pages/warehouse/Assets';
import AllRequests from '@/pages/warehouse/AllRequests';
import WarehouseManageAccount from '@/pages/warehouse/ManageAccount';
import EHSIssuance from '@/pages/warehouse/EHSIssuance';
import { WarehouseSidebar } from '@/components/warehouse/WarehouseSidebar';

export const warehouseRoutes: RouteObject[] = [
  {
    path: '/warehouse',
    element: (
      <ProtectedRoute allowedRoles={['warehouse']}>
        <WarehouseDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/warehouse/material-requests',
    element: (
      <ProtectedRoute allowedRoles={['warehouse']}>
        <WarehouseMaterialRequests />
      </ProtectedRoute>
    )
  },
  {
    path: '/warehouse/inventory',
    element: (
      <ProtectedRoute allowedRoles={['warehouse']}>
        <Inventory />
      </ProtectedRoute>
    )
  },
  {
    path: '/warehouse/assets',
    element: (
      <ProtectedRoute allowedRoles={['warehouse']}>
        <Assets />
      </ProtectedRoute>
    )
  },
  {
    path: '/warehouse/all-requests',
    element: (
      <ProtectedRoute allowedRoles={['warehouse']}>
        <AllRequests />
      </ProtectedRoute>
    )
  },
  {
    path: '/warehouse/manage-account',
    element: (
      <ProtectedRoute allowedRoles={['warehouse']}>
        <WarehouseManageAccount />
      </ProtectedRoute>
    )
  },
  {
    path: '/warehouse/ehs-issuance',
    element: (
      <ProtectedRoute allowedRoles={['warehouse']}>
        <EHSIssuance />
      </ProtectedRoute>
    )
  }
];
