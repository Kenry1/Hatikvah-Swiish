
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import OnboardingDashboard from '@/pages/onboarding/OnboardingDashboard';
import EmployeeSetup from '@/pages/onboarding/EmployeeSetup';

export const onboardingRoutes: RouteObject[] = [
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/setup',
    element: (
      <ProtectedRoute>
        <EmployeeSetup />
      </ProtectedRoute>
    )
  }
];
