// Install this package with: npm install react-qr-code
'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function PaymentQR({ userId, amount }) {
  const merchantUpiId = '8319462500-2@axl'; // Replace with your actual UPI ID
  const merchantName = 'Sumit Sharma SO Ram Kishore';
  const transactionNote = 'Registration Fee';
  
  // Construct UPI URL
  const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCode value={upiUrl} size={256} />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Scan with any UPI app to pay ₹{amount}
      </p>
    </div>
  );
}