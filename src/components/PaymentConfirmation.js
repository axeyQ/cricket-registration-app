'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentConfirmation({ userId, paymentId, transactionId, setTransactionId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          paymentId,
          transactionId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit transaction ID');
      }
      
      setMessage('Payment confirmation submitted. Your registration will be verified by admin.');
      
      // Optionally redirect to a thank you page
      // setTimeout(() => {
      //   router.push('/thank-you');
      // }, 2000);
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium mb-3">Confirm Your Payment</h4>
      
      {message && (
        <div className={`p-3 mb-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            UPI Transaction ID / Reference Number
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="e.g. 123456789012"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You can find this in your UPI app payment history or bank statement
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  );
}