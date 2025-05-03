
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PMDashboard from '@/pages/project_manager/PMDashboard';
import ProjectOverview from '@/pages/project_manager/ProjectOverview';
import RequestApprovals from '@/pages/project_manager/RequestApprovals';
import TaskAssignments from '@/pages/project_manager/TaskAssignments';
import EHSApprovals from '@/pages/project_manager/EHSApprovals';

export const projectManagerRoutes: RouteObject[] = [
  {
    path: '/project-manager',
    element: (
      <ProtectedRoute allowedRoles={['project_manager']}>
        <PMDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/project-manager/overview',
    element: (
      <ProtectedRoute allowedRoles={['project_manager']}>
        <ProjectOverview />
      </ProtectedRoute>
    )
  },
  {
    path: '/project-manager/approvals',
    element: (
      <ProtectedRoute allowedRoles={['project_manager']}>
        <RequestApprovals />
      </ProtectedRoute>
    )
  },
  {
    path: '/project-manager/tasks',
    element: (
      <ProtectedRoute allowedRoles={['project_manager']}>
        <TaskAssignments />
      </ProtectedRoute>
    )
  },
  {
    path: '/project-manager/ehs-approvals',
    element: (
      <ProtectedRoute allowedRoles={['project_manager']}>
        <EHSApprovals />
      </ProtectedRoute>
    )
  }
];
