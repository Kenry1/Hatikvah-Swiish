import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import React from 'react'; // Keep this import as it's used for React.ReactNode and React.FC

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state if auth state is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'management') {
    return <Navigate to="/1" replace />;
  }

  if (user?.role === 'technician') {
    return <Navigate to="/page2" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on their role
    // Temporarily redirecting management to /1 for debugging
    switch (user.role) {
      case 'technician':
        return <Navigate to="/page2" replace />;
      case 'warehouse':
        return <Navigate to="/warehouse/dashboard" replace />;
      case 'logistics':
        return <Navigate to="/logistics/dashboard" replace />;
      case 'hr':
        return <Navigate to="/hr/dashboard" replace />;
      case 'implementation_manager':
        return <Navigate to="/implementation-manager/dashboard" replace />;
      case 'project_manager':
        return <Navigate to="/project-manager/dashboard" replace />;
      case 'planning':
        return <Navigate to="/planning/dashboard" replace />;
      case 'it':
        return <Navigate to="/it/dashboard" replace />;
      case 'finance':
        return <Navigate to="/finance/dashboard" replace />;
      case 'management':
        return <Navigate to="/1" replace />;
      case 'ehs':
        return <Navigate to="/ehs/dashboard" replace />;
      case 'procurement':
        return <Navigate to="/procurement/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;