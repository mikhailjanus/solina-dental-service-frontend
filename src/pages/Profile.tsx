import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');

   useEffect(() => {
     if (user) {
       setFormData({
         firstName: user.firstName || '',
         middleName: user.middleName || '',
         lastName: user.lastName || '',
         phone: user.phone || '',
         address: user.address || ''
       });
     }
   }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/profile', {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address
      });
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {message && (
        <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" value={user?.email} className="w-full border rounded p-2 bg-gray-100" disabled />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full border rounded px-3 py-2 text-sm"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Middle Name</label>
              <input
                type="text"
                name="middleName"
                className="w-full border rounded px-3 py-2 text-sm"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full border rounded px-3 py-2 text-sm"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded p-2"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              className="w-full border rounded p-2"
              rows={3}
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;