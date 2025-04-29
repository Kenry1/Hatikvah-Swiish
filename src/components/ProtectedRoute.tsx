
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Show loading state if auth state is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on their role
    if (user.role === 'technician') {
      return <Navigate to="/technician" replace />;
    }
    if (user.role === 'warehouse') {
      return <Navigate to="/warehouse" replace />;
    }
    if (user.role === 'logistics') {
      return <Navigate to="/logistics" replace />;
    }
    
    // Fallback to login in case of issues
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
