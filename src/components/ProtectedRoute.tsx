import { Navigate, Outlet, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  if (loading) return <div>Loading...</div>;
  if (!token) return <Outlet />;
  
  // Redirect logged-in users based on their role
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  return <Navigate to="/" replace state={{ from: location }} />;
};