import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <input type="text" name="firstName" className="w-full border rounded p-2" value={formData.firstName} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Middle Name</label>
            <input type="text" name="middleName" className="w-full border rounded p-2" value={formData.middleName} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input type="text" name="lastName" className="w-full border rounded p-2" value={formData.lastName} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" name="email" className="w-full border rounded p-2" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input type="password" name="password" className="w-full border rounded p-2" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Confirm</label>
              <input type="password" name="confirmPassword" className="w-full border rounded p-2" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input type="text" name="phone" className="w-full border rounded p-2" value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Address</label>
            <textarea name="address" className="w-full border rounded p-2" rows={2} value={formData.address} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;