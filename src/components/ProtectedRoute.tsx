import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export interface RedirectState {
  from: string;
}

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const state: RedirectState = {
      from: `${location.pathname}${location.search}${location.hash}`,
    };
    return <Navigate to="/login" replace state={state} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
