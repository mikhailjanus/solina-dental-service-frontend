import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments', {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
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

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  if (!token || !user) {
    return <div className="text-center py-12">Please log in to view your appointments.</div>;
  }

  if (loading) return <div className="text-center py-12">Loading appointments...</div>;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No appointments found. Book your first appointment on the home page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(apt => (
            <div key={apt.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{apt.service_name}</h3>
                  <p className="text-gray-600">{apt.clinic_name}</p>
                  <p className="text-gray-500 mt-1">
                    {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time?.substring(0, 5)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[apt.status]}`}>
                  {apt.status}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between">
                <span className="text-gray-600">Amount: ${apt.total_amount}</span>
                <span className={`${apt.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  Payment: {apt.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;