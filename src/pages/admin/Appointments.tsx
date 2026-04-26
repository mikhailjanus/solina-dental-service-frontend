import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const formatDateLocal = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [showPatientSelectModal, setShowPatientSelectModal] = useState(false);
  const [patientSelectionTarget, setPatientSelectionTarget] = useState<'add' | 'edit' | null>(null);
  const [editAppointment, setEditAppointment] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      console.log('Sample appointment data:', appointments[0]);
    }
  }, [appointments]);

  useEffect(() => {
    if (editAppointment) {
      console.log('editAppointment state changed:', editAppointment);
    }
  }, [editAppointment]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      console.log('Raw API response:', res.data);
      if (res.data.length > 0) {
        console.log('First record keys:', Object.keys(res.data[0]));
        console.log('First record sample:', {
          firstName: res.data[0].patientFirstName,
          middleName: res.data[0].patientMiddleName,
          lastName: res.data[0].patientLastName,
          address: res.data[0].patientAddress,
          mobile: res.data[0].mobile_number
        });
      }
      setAppointments(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const fetchClinics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/clinics`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setClinics(res.data);
    } catch (err: any) {
      console.error('Failed to fetch clinics:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/services`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setServices(res.data);
    } catch (err: any) {
      console.error('Failed to fetch services:', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/patients`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setPatients(res.data);
    } catch (err: any) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewAppointment({
      patient_id: '',
      clinicId: '',
      serviceId: '',
      appointment_date: '',
      appointment_time: '',
      notes: '',
      status: 'pending' as const
    });
    setSelectedPatient(null);
  };

  const handleOpenEditModal = async (appointment: any) => {
    try {
      const token = localStorage.getItem('token');
      const [clinicsRes, servicesRes, patientsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clinics`, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
        axios.get(`${API_BASE_URL}/services`, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
        axios.get(`${API_BASE_URL}/patients`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      ]);
      console.log('Full appointment object:', JSON.stringify(appointment, null, 2));
      const clinicsData = clinicsRes.data;
      const servicesData = servicesRes.data;
      const patientsData = patientsRes.data;
      setClinics(clinicsData);
      setServices(servicesData);
      setPatients(patientsData);
      const selectedService = servicesData.find((s: any) => s.name === appointment.serviceName);
      const selectedClinic = clinicsData.find((c: any) => c.name === appointment.clinicName);
      const newState = {
        id: appointment.id,
        patient_id: appointment.patient_id || '',
        clinicId: selectedClinic ? selectedClinic.id : '',
        serviceId: selectedService ? selectedService.id : '',
        appointment_date: appointment.appointment_date ? formatDateLocal(appointment.appointment_date) : '',
        appointment_time: appointment.appointment_time,
        notes: appointment.notes || '',
        status: appointment.status || 'pending',
        total_amount: appointment.total_amount || appointment.amount
      };
      console.log('Setting editAppointment state with:', newState);
      setEditAppointment(newState);
      setShowEditModal(true);
    } catch (err) {
      console.error('Failed to fetch data for edit modal:', err);
      alert('Failed to load clinics/services/patients');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditAppointment(null);
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAppointment) return;
    setSavingEdit(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/appointments/${editAppointment.id}`,
        {
          patient_id: editAppointment.patient_id,
          clinic_id: editAppointment.clinicId,
          service_id: editAppointment.serviceId,
          appointment_date: editAppointment.appointment_date,
          appointment_time: editAppointment.appointment_time,
          status: editAppointment.status,
          notes: editAppointment.notes,
          total_amount: editAppointment.total_amount
        },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      fetchAppointments();
      handleCloseEditModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update appointment');
    } finally {
      setSavingEdit(false);
    }
  };

  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    clinicId: '',
    serviceId: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
    status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled'
  });
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const appointmentData = {
        patient_id: newAppointment.patient_id,
        service_id: newAppointment.serviceId,
        clinic_id: newAppointment.clinicId,
        appointment_date: newAppointment.appointment_date,
        appointment_time: newAppointment.appointment_time,
        notes: newAppointment.notes
      };
      await axios.post(`${API_BASE_URL}/appointments`, appointmentData, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      fetchAppointments();
      handleCloseAddModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create appointment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Appointments</h2>
          <span className="text-sm text-gray-500">Total: {appointments.length} appointments</span>
        </div>
        <button
          onClick={() => { fetchClinics(); fetchServices(); fetchPatients(); setShowAddModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Appointment
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
               <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Appointment Id</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Firstname</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Middlename</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Lastname</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Mobile</th>
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
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.id}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.patientFirstName}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.patientMiddleName}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.patientLastName}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.patientAddress}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.mobile_number}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.serviceName}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{apt.clinicName}</td>
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
                   <button
                     onClick={() => {
                       console.log('Clicked appointment:', apt);
                       handleOpenEditModal(apt);
                     }}
                     className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                   >
                     Edit
                   </button>
                 </td>
               </tr>
             ))}
             {appointments.length === 0 && (
               <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                    No appointments found
                  </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>

       {/* Add Appointment Modal */}
       {showAddModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg w-full max-w-lg mx-4">
             <div className="flex justify-between items-center p-6 border-b">
               <h3 className="text-lg font-bold">Add New Appointment</h3>
               <button onClick={handleCloseAddModal} className="text-gray-400 hover:text-gray-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             <form onSubmit={handleCreateAppointment}>
               <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                      <button
                        type="button"
                        onClick={() => {
                          fetchPatients();
                          setPatientSelectionTarget('add');
                          setShowPatientSelectModal(true);
                        }}
                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors text-left"
                      >
                        {selectedPatient ? 'Change Patient' : 'Select Patient'}
                      </button>
                    </div>
                  </div>
                  {selectedPatient && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedPatient.patientFirstName} {selectedPatient.patientMiddleName} {selectedPatient.patientLastName}</p>
                        <p><span className="font-medium">Address:</span> {selectedPatient.address}</p>
                        <p><span className="font-medium">Mobile:</span> {selectedPatient.mobileNumber}</p>
                      </div>
                    </div>
                  )}
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
                     <select
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={newAppointment.clinicId}
                       onChange={e => setNewAppointment({ ...newAppointment, clinicId: e.target.value })}
                     >
                       <option value="">Select clinic</option>
                       {clinics.map((c: any) => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                     <select
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={newAppointment.serviceId}
                       onChange={e => setNewAppointment({ ...newAppointment, serviceId: e.target.value })}
                     >
                       <option value="">Select service</option>
                       {services.map((s: any) => (
                         <option key={s.id} value={s.id}>{s.name} - ₱{s.price_range_from} - ₱{s.price_range_to}</option>
                       ))}
                     </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Service Price Range)</label>
                     <div className="flex items-center gap-2">
                       <span className="text-lg font-bold text-green-600">
                         {(() => {
                           const selectedService = services.find((s: any) => s.id === parseInt(newAppointment.serviceId));
                           if (selectedService) {
                             return `₱${selectedService.price_range_from} - ₱${selectedService.price_range_to}`;
                           }
                           return '₱0.00 - ₱0.00';
                         })()}
                       </span>
                     </div>
                     <input
                       type="number"
                       step="0.01"
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm mt-2 font-semibold text-gray-900"
                       placeholder="Editable price"
                       value={
                         (() => {
                           const selectedService = services.find((s: any) => s.id === parseInt(newAppointment.serviceId));
                           return selectedService ? selectedService.price : '';
                         })()
                       }
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                     <select
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={newAppointment.status || "pending"}
                        onChange={e => setNewAppointment({ ...newAppointment, status: e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled' })}
                     >
                       <option value="pending">Pending</option>
                       <option value="confirmed">Confirmed</option>
                       <option value="completed">Completed</option>
                       <option value="cancelled">Cancelled</option>
                     </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                     <input
                       type="date"
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={newAppointment.appointment_date}
                       onChange={e => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                     <input
                       type="time"
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={newAppointment.appointment_time}
                       onChange={e => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                   <textarea
                     className="w-full px-3 py-2 border rounded-lg text-sm"
                     rows={3}
                     value={newAppointment.notes}
                     onChange={e => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                     placeholder="Additional notes..."
                   ></textarea>
                 </div>
               </div>
               <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
                 <button
                   type="button"
                   onClick={handleCloseAddModal}
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={saving}
                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                 >
                   {saving ? 'Saving...' : 'Create Appointment'}
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* Edit Appointment Modal */}
       {showEditModal && editAppointment && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg w-full max-w-lg mx-4">
             <div className="flex justify-between items-center p-6 border-b">
               <h3 className="text-lg font-bold">Edit Appointment</h3>
               <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             <form onSubmit={handleUpdateAppointment}>
               <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                      <button
                        type="button"
                        onClick={() => {
                          fetchPatients();
                          setPatientSelectionTarget('edit');
                          setShowPatientSelectModal(true);
                        }}
                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors text-left"
                      >
                        {editAppointment?.patient_id ? 'Change Patient' : 'Select Patient'}
                      </button>
                    </div>
                  </div>
                  {editAppointment?.patient_id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {patients.find((p: any) => p.id === editAppointment.patient_id)?.patientFirstName} {patients.find((p: any) => p.id === editAppointment.patient_id)?.patientMiddleName} {patients.find((p: any) => p.id === editAppointment.patient_id)?.patientLastName}</p>
                        <p><span className="font-medium">Address:</span> {patients.find((p: any) => p.id === editAppointment.patient_id)?.address}</p>
                        <p><span className="font-medium">Mobile:</span> {patients.find((p: any) => p.id === editAppointment.patient_id)?.mobileNumber}</p>
                      </div>
                    </div>
                  )}
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
                     <select
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={editAppointment.clinicId}
                       onChange={e => setEditAppointment({ ...editAppointment, clinicId: e.target.value })}
                     >
                       <option value="">Select clinic</option>
                       {clinics.map((c: any) => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                     <select
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={editAppointment.serviceId}
                       onChange={e => setEditAppointment({ ...editAppointment, serviceId: e.target.value })}
                     >
                       <option value="">Select service</option>
                       {services.map((s: any) => (
                         <option key={s.id} value={s.id}>{s.name} - ₱{s.price_range_from} - ₱{s.price_range_to}</option>
                       ))}
                     </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Serice Price Range</label>
                     <div className="flex items-center gap-2">
                       <span className="text-lg font-bold text-green-600">
                         {(() => {
                           const selectedService = services.find((s: any) => s.id === parseInt(editAppointment.serviceId));
                           if (selectedService && selectedService.price_range_from && selectedService.price_range_to) {
                             return `$${selectedService.price_range_from} - $${selectedService.price_range_to}`;
                           }
                           return editAppointment.total_amount ? `$${parseFloat(editAppointment.total_amount).toFixed(2)}` : '$0.00 - $0.00';
                         })()}
                       </span>
                     </div>
                     <input
                       type="number"
                       step="0.01"
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm mt-2 font-semibold text-gray-900"
                       placeholder="Editable price"
                       value={editAppointment.total_amount || ''}
                       onChange={e => setEditAppointment({ ...editAppointment, total_amount: e.target.value })}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                     <select
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={editAppointment.status || 'pending'}
                       onChange={e => setEditAppointment({ ...editAppointment, status: e.target.value })}
                     >
                       <option value="pending">Pending</option>
                       <option value="confirmed">Confirmed</option>
                       <option value="completed">Completed</option>
                       <option value="cancelled">Cancelled</option>
                     </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                     <input
                       type="date"
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={editAppointment.appointment_date}
                       onChange={e => setEditAppointment({ ...editAppointment, appointment_date: e.target.value })}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                     <input
                       type="time"
                       required
                       className="w-full px-3 py-2 border rounded-lg text-sm"
                       value={editAppointment.appointment_time}
                       onChange={e => setEditAppointment({ ...editAppointment, appointment_time: e.target.value })}
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                   <textarea
                     className="w-full px-3 py-2 border rounded-lg text-sm"
                     rows={3}
                     value={editAppointment.notes}
                     onChange={e => setEditAppointment({ ...editAppointment, notes: e.target.value })}
                     placeholder="Additional notes..."
                   ></textarea>
                 </div>
               </div>
               <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
                 <button
                   type="button"
                   onClick={handleCloseEditModal}
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={savingEdit}
                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                 >
                   {savingEdit ? 'Saving...' : 'Update Appointment'}
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* Patient Selection Modal */}
       {showPatientSelectModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
             <div className="flex justify-between items-center p-6 border-b">
               <h3 className="text-lg font-bold">Select Patient</h3>
               <button onClick={() => setShowPatientSelectModal(false)} className="text-gray-400 hover:text-gray-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             <div className="p-6">
               <div className="max-h-96 overflow-y-auto">
                 {patients.length === 0 ? (
                   <div className="text-center py-12 text-gray-500">
                     <p>No patients found</p>
                     <p className="text-sm mt-2">Please add patients first</p>
                   </div>
                 ) : (
                   <div className="grid gap-3">
                     {patients.map((p: any) => (
                       <div
                         key={p.id}
                         className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                         onClick={() => {
                           if (patientSelectionTarget === 'add') {
                             setNewAppointment({ ...newAppointment, patient_id: p.id });
                             setSelectedPatient(p);
                           } else if (patientSelectionTarget === 'edit') {
                             setEditAppointment({ ...editAppointment, patient_id: p.id });
                           }
                           setShowPatientSelectModal(false);
                         }}
                       >
                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                           {p.patientFirstName?.[0]}{p.patientLastName?.[0]}
                         </div>
                         <div className="flex-1">
                           <h4 className="font-medium text-gray-900">
                             {p.patientFirstName} {p.patientMiddleName} {p.patientLastName}
                           </h4>
                           <p className="text-sm text-gray-500">{p.mobileNumber}</p>
                           <p className="text-sm text-gray-500">{p.address}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
             <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
               <button
                 type="button"
                 onClick={() => setShowPatientSelectModal(false)}
                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
};

export default AdminAppointments;