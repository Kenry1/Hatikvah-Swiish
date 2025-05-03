
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import HRDashboard from '@/pages/hr/HRDashboard';
import Employees from '@/pages/hr/Employees';
import NewEmployee from '@/pages/hr/NewEmployee';
import Documents from '@/pages/hr/Documents';
import EmployeeDocuments from '@/pages/hr/EmployeeDocuments';
import HRManageAccount from '@/pages/hr/ManageAccount';

export const hrRoutes: RouteObject[] = [
  {
    path: '/hr',
    element: (
      <ProtectedRoute allowedRoles={['hr']}>
        <HRDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/employees',
    element: (
      <ProtectedRoute allowedRoles={['hr']}>
        <Employees />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/employees/new',
    element: (
      <ProtectedRoute allowedRoles={['hr']}>
        <NewEmployee />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/documents',
    element: (
      <ProtectedRoute allowedRoles={['hr']}>
        <Documents />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/documents/:employeeId',
    element: (
      <ProtectedRoute allowedRoles={['hr']}>
        <EmployeeDocuments />
      </ProtectedRoute>
    )
  },
  {
    path: '/hr/manage-account',
    element: (
      <ProtectedRoute allowedRoles={['hr']}>
        <HRManageAccount />
      </ProtectedRoute>
    )
  }
];
