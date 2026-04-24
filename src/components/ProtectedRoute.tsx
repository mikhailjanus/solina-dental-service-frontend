import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { user, token, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute = () => {
  const { user, token, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export const GuestRoute = () => {
  const { user, token, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return !token ? <Outlet /> : <Navigate to="/" />;
};