import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminIncome = () => {
  const [income, setIncome] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    fetchIncome();
    fetchSummary();
  }, []);

  const fetchIncome = async () => {
    const res = await axios.get('http://localhost:5000/api/admin');
    setIncome(res.data);
  };

  const fetchSummary = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/summary');
    setSummary(res.data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Income Management</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">${summary.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Today's Income</h3>
          <p className="text-3xl font-bold text-blue-600">${summary.today || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Transactions</h3>
          <p className="text-3xl font-bold text-purple-600">{income.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Service</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {income.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4">{new Date(item.payment_date).toLocaleString()}</td>
                <td className="px-6 py-4">{item.patient_name}</td>
                <td className="px-6 py-4">{item.service_name}</td>
                <td className="px-6 py-4 font-semibold text-green-600">${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminIncome;