import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { Role } from '../Services/IAuthService';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, roles } = useContext(AuthContext);

  if (!user || !roles || !roles.includes(Role.ADMIN)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
