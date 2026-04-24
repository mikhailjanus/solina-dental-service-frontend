import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setAppointments(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, 
        { status },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update appointment');
      console.error('Error updating appointment:', err);
    }
  };

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (selectedAppointment) {
      updateStatus(selectedAppointment.id, newStatus);
      handleCloseModal();
    }
  };

  if (!token || !user) {
    return <div className="p-8 text-center">Please log in to access this page.</div>;
  }

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

  if (error && appointments.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Appointments</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

   return (
    <div>
      <div>
        <h2 className="text-2xl font-bold">Manage Appointments</h2>
        <span className="text-sm text-gray-500">Total: {appointments.length} appointments</span>
      </div>
      <div className="mb-6"></div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Patient</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Service</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Clinic</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date & Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {appointments.map(apt => (
              <tr key={apt.id}>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">{apt.patient_name}</p>
                    <p className="text-sm text-gray-500">{apt.patient_email}</p>
                  </div>
                </td>
                <td className="px-4 py-4">{apt.service_name}</td>
                <td className="px-4 py-4">{apt.clinic_name}</td>
                <td className="px-4 py-4">
                  {new Date(apt.appointment_date).toLocaleDateString()}<br />
                  {apt.appointment_time?.substring(0, 5)}
                </td>
                <td className="px-4 py-4">${apt.total_amount}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[apt.status]}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button 
                    onClick={() => handleEdit(apt)} 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Appointment Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">Patient:</p>
                <p>{selectedAppointment.patient_name}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{selectedAppointment.patient_email}</p>
              </div>
              <div>
                <p className="font-medium">Service:</p>
                <p>{selectedAppointment.service_name}</p>
              </div>
              <div>
                <p className="font-medium">Clinic:</p>
                <p>{selectedAppointment.clinic_name}</p>
              </div>
              <div>
                <p className="font-medium">Date & Time:</p>
                <p>
                  {new Date(selectedAppointment.appointment_date).toLocaleDateString()} at{' '}
                  {selectedAppointment.appointment_time?.substring(0, 5)}
                </p>
              </div>
              <div>
                <p className="font-medium">Amount:</p>
                <p>${selectedAppointment.total_amount}</p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <select
                  value={selectedAppointment.status}
                  onChange={handleStatusChange}
                  className="border rounded p-2 w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={handleCloseModal}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleCloseModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;