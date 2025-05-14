import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

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

// Get all registrations with payment info
export async function GET(request) {
  try {
    const adminData = verifyAdminToken(request);
    
    if (!adminData) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch users with their payment information
    const registrations = await prisma.user.findMany({
      include: {
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Format the data for the frontend
    const formattedRegistrations = registrations.map(user => {
      const payment = user.payments[0] || {}; // Get the latest payment
      
      return {
        id: user.id,
        name: user.name,
        address: user.address,
        whatsappNumber: user.whatsappNumber,
        dateOfBirth: user.dateOfBirth,
        battingHand: user.battingHand,
        bowlingHand: user.bowlingHand,
        createdAt: user.createdAt,
        paymentId: payment.id || null,
        paymentAmount: payment.amount || 0,
        paymentStatus: payment.status || 'none',
        transactionId: payment.transactionId || null,
      };
    });
    
    return NextResponse.json(formattedRegistrations);
    
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ message: 'Failed to fetch registrations' }, { status: 500 });
  }
}