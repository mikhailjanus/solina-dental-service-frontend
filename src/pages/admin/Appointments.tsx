import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    patient_id: '',
    service_id: '',
    clinic_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAddModalOpen) {
      fetchFormData();
    }
  }, [isAddModalOpen]);

  const fetchFormData = async () => {
    try {
      const [patientsRes, servicesRes, clinicsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/patients`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        }),
        axios.get(`${API_BASE_URL}/services`),
        axios.get(`${API_BASE_URL}/clinics`)
      ]);
      setPatients(patientsRes.data);
      setServices(servicesRes.data);
      setClinics(clinicsRes.data);
      setFormError(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to load form data');
      console.error('Error loading form data:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/appointments`, {
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
      await axios.put(`${API_BASE_URL}/appointments/${id}/status`,
        { status },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update appointment');
      console.error('Error updating appointment:', err);
    }
  };

  const handleAddNew = () => {
    setFormData({
      patient_id: '',
      service_id: '',
      clinic_id: '',
      appointment_date: '',
      appointment_time: '',
      notes: ''
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await axios.post(`${API_BASE_URL}/appointments`, {
        user_id: formData.patient_id,
        service_id: formData.service_id,
        clinic_id: formData.clinic_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        notes: formData.notes
      }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      fetchAppointments();
      setIsAddModalOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create appointment');
      console.error('Error creating appointment:', err);
    } finally {
      setFormLoading(false);
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

      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-500">Total: {appointments.length} appointments</span>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
        >
          Add New Appointment
        </button>
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

      {/* Add New Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Add New Appointment</h3>
            
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  className="border rounded p-2 w-full"
                  required
                  disabled={formLoading}
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>{patient.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  className="border rounded p-2 w-full"
                  required
                  disabled={formLoading}
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name} - ${service.price}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
                <select
                  value={formData.clinic_id}
                  onChange={(e) => setFormData({ ...formData, clinic_id: e.target.value })}
                  className="border rounded p-2 w-full"
                  required
                  disabled={formLoading}
                >
                  <option value="">Select Clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    className="border rounded p-2 w-full"
                    required
                    disabled={formLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                    className="border rounded p-2 w-full"
                    required
                    disabled={formLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="border rounded p-2 w-full"
                  rows={3}
                  disabled={formLoading}
                />
              </div>
              
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {formError}
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border px-4 py-2 rounded hover:bg-gray-100" 
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading ? 'Creating...' : 'Create Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Edit Appointment</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={selectedAppointment.patient_name}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, patient_name: e.target.value})}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedAppointment.patient_email}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, patient_email: e.target.value})}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  value={selectedAppointment.service_name}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, service_name: e.target.value})}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
                <input
                  type="text"
                  value={selectedAppointment.clinic_name}
                  onChange={(e) => setSelectedAppointment({...selectedAppointment, clinic_name: e.target.value})}
                  className="border rounded p-2 w-full"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                 <input
                   type="date"
                   value={selectedAppointment.appointment_date ? selectedAppointment.appointment_date.split('T')[0] : ''}
                   onChange={(e) => setSelectedAppointment({...selectedAppointment, appointment_date: e.target.value})}
                   className="border rounded p-2 w-full"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                 <input
                   type="time"
                   value={selectedAppointment.appointment_time?.substring(0, 5)}
                   onChange={(e) => setSelectedAppointment({...selectedAppointment, appointment_time: e.target.value})}
                   className="border rounded p-2 w-full"
                 />
               </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedAppointment.total_amount}
                    onChange={(e) => setSelectedAppointment({...selectedAppointment, total_amount: e.target.value})}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedAppointment.status}
                    onChange={(e) => setSelectedAppointment({...selectedAppointment, status: e.target.value})}
                    className="border rounded p-2 w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleStatusChange({target: {value: selectedAppointment.status}})}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
     </div>
  );
};

export default AdminAppointments;