import { useState, useEffect } from 'react';
import axios from 'axios';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  is_active: number; // 0 or 1
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<{name: string; description: string; price: string; duration: string; is_active: number}>({
    name: '',
    description: '',
    price: '',
    duration: '',
    is_active: 1
  });

  useEffect(() => {
    fetchServices();
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

   const fetchServices = async () => {
     const res = await axios.get('http://localhost:5000/api/services');
     setServices(res.data.map((service: Service) => ({
       ...service,
       is_active: Number(service.is_active) === 1 ? 1 : 0
     })));
   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`http://localhost:5000/api/services/${editingService.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/services', formData);
      }
      fetchServices();
      handleCloseModal();
    } catch (error) {
      alert('Failed to save service');
    }
  };

    const handleEdit = (service: Service) => {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString(),
        is_active: Number(service.is_active) === 1 ? 1 : 0
      });
      setIsModalOpen(true);
    };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      fetchServices();
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      await axios.put(`http://localhost:5000/api/services/${service.id}`, {
        ...service,
        is_active: Number(service.is_active) === 1 ? 0 : 1
      });
      fetchServices();
    } catch (error) {
      alert('Failed to update service status');
    }
  };

  const handleCloseModal = () => {
    setEditingService(null);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', price: '', duration: '', is_active: 1 });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Services</h2>
          <span className="text-sm text-gray-500">Total: {services.length} services</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setStatusFilter('all')} 
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${statusFilter === 'all' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter('active')} 
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${statusFilter === 'active' ? 'bg-white shadow text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setStatusFilter('inactive')} 
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${statusFilter === 'inactive' ? 'bg-white shadow text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Inactive
            </button>
          </div>
          <button onClick={() => {
            setEditingService(null);
            setFormData({ name: '', description: '', price: '', duration: '', is_active: 1 });
            setIsModalOpen(true);
          }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add New Service
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-gray-700 mb-1">Service Name</label>
                 <input
                   type="text"
                   className="w-full border rounded p-2"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   required
                 />
               </div>
               <div className="grid gap-4">
                 <div>
                   <label className="block text-gray-700 mb-1">Price ($)</label>
                   <div className="flex items-center">
                     <span className="mr-2">$</span>
                     <input
                       type="number"
                       step="0.01"
                       className="w-full border rounded p-2"
                       value={formData.price}
                       onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                       required
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-gray-700 mb-1">Duration (min)</label>
                   <input
                     type="number"
                     className="w-full border rounded p-2"
                     value={formData.duration}
                     onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                     required
                   />
                 </div>
               </div>
             </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-gray-700">Service is active (visible to patients)</label>
              </div>
              <div className="flex space-x-3 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Service</button>
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Duration</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(() => {
              const filteredServices = services.filter((service: Service) => {
                if (statusFilter === 'active') return Number(service.is_active) === 1;
                if (statusFilter === 'inactive') return Number(service.is_active) === 0;
                return true;
              });

             if (filteredServices.length === 0) {
               return (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                     No {statusFilter === 'all' ? '' : statusFilter} services found
                   </td>
                 </tr>
               );
             }

             return filteredServices.map(service => (
               <tr key={service.id}>
                 <td className="px-6 py-4">{service.name}</td>
                 <td className="px-6 py-4">${service.price}</td>
                 <td className="px-6 py-4">{service.duration} min</td>
                 <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${Number(service.is_active) === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {Number(service.is_active) === 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                 <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleEdit(service)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
               </tr>
             ));
           })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServices;