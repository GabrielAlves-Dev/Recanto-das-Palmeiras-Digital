import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth.types';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = allowedRoles.includes(currentUser.role);

  console.log('Current User Role:', currentUser);

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;