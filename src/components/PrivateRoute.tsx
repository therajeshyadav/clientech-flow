import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  
  console.log('PrivateRoute check:', { isAuthenticated, hasToken: !!token });
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;