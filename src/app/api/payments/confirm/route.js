import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const { userId, paymentId, transactionId } = await request.json();
    
    // Validate required fields
    if (!userId || !paymentId || !transactionId) {
      return NextResponse.json({ 
        message: 'User ID, payment ID, and transaction ID are required' 
      }, { status: 400 });
    }
    
    // Update the payment with transaction ID
    await prisma.payment.update({
      where: { id: parseInt(paymentId) },
      data: {
        transactionId: transactionId,
        // Keep status as pending, so admin can verify
      },
    });
    
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