import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Payment } from '@/models';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    const { userId, paymentId, transactionId } = await request.json();
    
    // Validate required fields
    if (!userId || !paymentId || !transactionId) {
      return NextResponse.json({ 
        message: 'User ID, payment ID, and transaction ID are required' 
      }, { status: 400 });
    }
    
    // Update the payment with transaction ID
    await Payment.findByIdAndUpdate(
      paymentId,
      { transactionId: transactionId }
    );
    
    return NextResponse.json({ 
      message: 'Payment confirmation submitted successfully' 
    });
    
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json({ 
      message: 'Failed to submit payment confirmation' 
    }, { status: 500 });
  }
}