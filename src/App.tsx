import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminAppointments from './pages/admin/Appointments';
import AdminIncome from './pages/admin/Income';
import AdminClinics from './pages/admin/Clinics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              <Route element={<ProtectedRoute />}>
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
               <Route element={<AdminRoute />}>
                 <Route path="/admin" element={<AdminDashboard />} />
                 <Route path="/admin/services" element={<AdminServices />} />
                 <Route path="/admin/appointments" element={<AdminAppointments />} />
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
