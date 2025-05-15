import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import { Payment } from '@/models';
import mongoose from 'mongoose';

// Helper function to verify admin token
const verifyAdminToken = (request) => {
  try {
    const authCookie = cookies().get('admin_auth');
    
    if (!authCookie) {
      return null;
    }
    
    const decodedToken = jwt.verify(
      authCookie.value,
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    return decodedToken;
  } catch (error) {
    return null;
  }
};

export async function PUT(request, { params }) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    const paymentId = params.id;
    const adminData = verifyAdminToken(request);
    
    if (!adminData) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate payment ID
    if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
      return NextResponse.json({ message: 'Invalid payment ID' }, { status: 400 });
    }
    
    // Check if payment exists
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }
    
    // Update payment status to approved
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: 'approved' },
      { new: true }
    );
    
    return NextResponse.json({
      message: 'Payment approved successfully',
      payment: updatedPayment,
    });
    
  } catch (error) {
    console.error('Error approving payment:', error);
    return NextResponse.json({ message: 'Failed to approve payment' }, { status: 500 });
  }
}