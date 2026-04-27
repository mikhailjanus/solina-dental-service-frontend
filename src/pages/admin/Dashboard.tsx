import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>({});
  const [income, setIncome] = useState<any>({});

  useEffect(() => {
    fetchStats();
    fetchIncome();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`);
    setStats(res.data);
  };

  const fetchIncome = async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/summary`);
    setIncome(res.data);
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold">Admin Dashboard</h2>
         <div className="space-x-3">
           <Link to="/admin/services" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Manage Services</Link>
           <Link to="/admin/clinics" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Manage Clinics</Link>
           <Link to="/admin/appointments" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Appointments</Link>
           <Link to="/admin/income" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Income</Link>
         </div>
       </div>

       <div className="grid md:grid-cols-6 gap-6 mb-8">
         <div className="bg-white rounded-lg shadow p-6">
           <h3 className="text-gray-500 text-sm">Total Appointments</h3>
           <p className="text-3xl font-bold text-blue-600">{stats.totalAppointments || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6">
           <h3 className="text-gray-500 text-sm">Pending</h3>
           <p className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6">
           <h3 className="text-gray-500 text-sm">Confirmed</h3>
           <p className="text-3xl font-bold text-blue-500">{stats.confirmedAppointments || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6">
           <h3 className="text-gray-500 text-sm">Completed</h3>
           <p className="text-3xl font-bold text-green-600">{stats.completedAppointments || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6">
           <h3 className="text-gray-500 text-sm">Cancelled</h3>
           <p className="text-3xl font-bold text-red-600">{stats.cancelledAppointments || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6">
           <h3 className="text-gray-500 text-sm">Total Patients</h3>
           <p className="text-3xl font-bold text-green-600">{stats.totalPatients || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
           <h3 className="text-gray-500 text-sm">Total Income</h3>
           <p className="text-3xl font-bold text-purple-600">${income.total || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
           <h3 className="text-gray-500 text-sm">Today's Income</h3>
           <p className="text-4xl font-bold text-green-600">${income.today || 0}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
           <h3 className="text-gray-500 text-sm">Active Services</h3>
           <p className="text-4xl font-bold text-blue-600">{stats.totalServices || 0}</p>
         </div>
       </div>
    </div>
  );
};

export default AdminDashboard;