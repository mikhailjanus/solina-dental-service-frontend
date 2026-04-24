import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setAppointments(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/appointments/${id}/status`, 
        { status },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const nextStatus: any = {
    pending: 'confirmed',
    confirmed: 'completed',
    completed: 'completed',
    cancelled: 'cancelled'
  };

  const statusLabels: any = {
    pending: 'Confirm',
    confirmed: 'Mark Complete',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Appointments</h2>
          <span className="text-sm text-gray-500">Total: {appointments.length} appointments</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Service</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Clinic</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date & Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {appointments.map((apt: any) => (
              <tr key={apt.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {apt.patient_name || `${apt.firstName} ${apt.lastName}`}
                  </div>
                  <div className="text-sm text-gray-500">{apt.email || apt.patient_email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{apt.service_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{apt.clinic_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{new Date(apt.appointment_date).toLocaleDateString()}</div>
                  <div className="text-gray-500">{apt.appointment_time?.substring(0, 5)}</div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${apt.total_amount || apt.amount}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[apt.status]}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, nextStatus[apt.status])}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {statusLabels[apt.status]}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointments;
