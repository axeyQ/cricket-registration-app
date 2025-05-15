import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import { User, Payment } from '@/models';

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
    console.error('Token verification error:', error);
    return null;
  }
};

// Get all registrations with payment info
export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    const adminData = verifyAdminToken(request);
    
    if (!adminData) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch users with their payment information using MongoDB
    const users = await User.find().sort({ createdAt: -1 });
    
    // For each user, get their payments
    const registrations = await Promise.all(users.map(async (user) => {
      const payments = await Payment.find({ userId: user._id });
      const payment = payments[0] || {}; // Get the latest payment
      
      return {
        id: user._id,
        name: user.name,
        address: user.address,
        whatsappNumber: user.whatsappNumber || '',
        dateOfBirth: user.dateOfBirth,
        battingHand: user.battingHand,
        bowlingHand: user.bowlingHand,
        createdAt: user.createdAt,
        paymentId: payment._id || null,
        paymentAmount: payment.amount || 0,
        paymentStatus: payment.status || 'none',
        transactionId: payment.transactionId || null,
      };
    }));
    
    return NextResponse.json(registrations);
    
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ message: 'Failed to fetch registrations' }, { status: 500 });
  }
}