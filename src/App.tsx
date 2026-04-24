import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import PublicNavbar from './components/PublicNavbar';
import AdminNavbar from './components/AdminNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminIncome from './pages/admin/Income';
import AdminClinics from './pages/admin/Clinics';
import AdminAppointments from './pages/admin/Appointments';
import AdminPatients from './pages/admin/Patients';

const NavbarWrapper = () => {
  const location = useLocation();
  
  if (location.pathname.startsWith('/admin')) {
    return <AdminNavbar />;
  }
  
  return <PublicNavbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavbarWrapper />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route element={<GuestRoute />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>
              
              <Route element={<ProtectedRoute />}>
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/services" element={<AdminServices />} />
                  <Route path="/admin/appointments" element={<AdminAppointments />} />
                  <Route path="/admin/patients" element={<AdminPatients />} />
                  <Route path="/admin/income" element={<AdminIncome />} />
                  <Route path="/admin/clinics" element={<AdminClinics />} />
                </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
