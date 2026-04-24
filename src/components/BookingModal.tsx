import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface BookingModalProps {
  service: any;
  clinics: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal = ({ service, clinics, onClose, onSuccess }: BookingModalProps) => {
  const [selectedClinic, setSelectedClinic] = useState<number>(clinics[0]?.id || 0);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedClinic && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedClinic, selectedDate]);

  const fetchAvailableSlots = async () => {
    const res = await axios.get(`${API_BASE_URL}/appointments/available-slots`, {
      params: { clinic_id: selectedClinic, date: selectedDate }
    });
    setAvailableSlots(res.data);
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/appointments`, {
        service_id: service.id,
        clinic_id: selectedClinic,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes
      });
      alert('Appointment booked successfully!');
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Book {service.name}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Select Clinic</label>
            <select
              className="w-full border rounded p-2"
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(Number(e.target.value))}
            >
              {clinics.map(clinic => (
                <option key={clinic.id} value={clinic.id}>{clinic.name} - {clinic.address}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              min={today}
              className="w-full border rounded p-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-gray-700 mb-2">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-2 rounded text-sm ${
                      slot.available
                        ? selectedTime === slot.time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-blue-100'
                        : 'bg-red-100 text-red-600 cursor-not-allowed'
                    }`}
                  >
                    {slot.time} {!slot.available && '(Booked)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="font-semibold">Total: ${service.price}</p>
            <p className="text-sm text-gray-600">Duration: {service.duration} minutes</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!selectedTime}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;