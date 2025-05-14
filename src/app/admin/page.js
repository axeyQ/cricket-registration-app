'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch registrations on component mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/registrations');
      
      if (response.status === 401) {
        // Unauthorized, redirect to login
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      const response = await fetch(`/api/admin/payments/approve/${paymentId}`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve payment');
      }
      
      // Refresh registrations list
      fetchRegistrations();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleReject = async (paymentId) => {
    try {
      const response = await fetch(`/api/admin/payments/reject/${paymentId}`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject payment');
      }
      
      // Refresh registrations list
      fetchRegistrations();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Playing Style
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{reg.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(reg.dateOfBirth).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{reg.address}</div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">WhatsApp:</span> {reg.whatsappNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          Batting: <span className="font-medium">{reg.battingHand}</span>
                        </div>
                        <div className="text-sm text-gray-900">
                          Bowling: <span className="font-medium">{reg.bowlingHand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${reg.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                            reg.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {reg.paymentStatus}
                        </span>
                        {reg.transactionId && (
                          <div className="text-xs text-gray-500 mt-1">
                            Trans ID: {reg.transactionId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{reg.paymentAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {reg.paymentStatus === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(reg.paymentId)}
                              className="text-green-600 hover:text-green-900 bg-green-100 px-2 py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(reg.paymentId)}
                              className="text-red-600 hover:text-red-900 bg-red-100 px-2 py-1 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}