import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  is_active: boolean;
}

const AdminClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    operating_hours: '',
    is_active: true
  });

  useEffect(() => {
    fetchClinics();
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

  const fetchClinics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/clinics`);
      setClinics(res.data);
    } catch (error) {
      alert('Failed to fetch clinics');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClinic) {
        await axios.put(`${API_BASE_URL}/clinics/${editingClinic.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/clinics`, formData);
      }
      fetchClinics();
      handleCloseModal();
    } catch (error) {
      alert('Failed to save clinic');
    }
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      operating_hours: clinic.operating_hours,
      is_active: clinic.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this clinic?')) {
      try {
        await axios.delete(`${API_BASE_URL}/clinics/${id}`);
        fetchClinics();
      } catch (error) {
        alert('Failed to delete clinic');
      }
    }
  };

  const handleCloseModal = () => {
    setEditingClinic(null);
    setIsModalOpen(false);
    setFormData({
      name: '',
      address: '',
      phone: '',
      operating_hours: '',
      is_active: true
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Clinics</h2>
          <span className="text-sm text-gray-500">Total: {clinics.length} clinics</span>
        </div>
        <button onClick={() => {
          setEditingClinic(null);
          setFormData({
            name: '',
            address: '',
            phone: '',
            operating_hours: '',
            is_active: true
          });
          setIsModalOpen(true);
        }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Clinic
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{editingClinic ? 'Edit Clinic' : 'Add New Clinic'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full border rounded p-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
               <div>
                 <label className="block text-gray-700 mb-1">Operating Hours</label>
                 <input
                   type="text"
                   className="w-full border rounded p-2"
                   value={formData.operating_hours}
                   onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                   required
                 />
               </div>
               <div>
                 <label className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     className="w-4 h-4"
                     checked={formData.is_active}
                     onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                   />
                   <span className="text-gray-700">Is Active</span>
                 </label>
               </div>
              <div className="flex space-x-3 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Clinic</button>
                <button type="button" onClick={handleCloseModal} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Operating Hours</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Is Active</th>
               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
             </tr>
           </thead>
          <tbody className="divide-y">
             {clinics.map(clinic => (
               <tr key={clinic.id}>
                 <td className="px-6 py-4">{clinic.name}</td>
                 <td className="px-6 py-4">{clinic.address}</td>
                 <td className="px-6 py-4">{clinic.phone}</td>
                 <td className="px-6 py-4">{clinic.operating_hours}</td>
                 <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded text-xs font-medium ${clinic.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {clinic.is_active ? 'Active' : 'Inactive'}
                   </span>
                 </td>
                 <td className="px-6 py-4 space-x-2">
                   <button onClick={() => handleEdit(clinic)} className="text-blue-600 hover:underline">Edit</button>
                   <button onClick={() => handleDelete(clinic.id)} className="text-red-600 hover:underline">Delete</button>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClinics;