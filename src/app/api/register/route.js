import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'address', 'whatsappNumber', 'dateOfBirth', 'bowlingHand', 'battingHand'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        address: data.address,
        whatsappNumber: data.whatsappNumber,
        dateOfBirth: new Date(data.dateOfBirth),
        bowlingHand: data.bowlingHand,
        battingHand: data.battingHand,
      },
    });
    
    // Create a pending payment record
    const amount = 300; // Example fixed amount - customize as needed
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: amount,
        status: 'pending',
      },
    });
    
    return NextResponse.json({ 
      message: 'Registration successful', 
      userId: user.id,
      paymentId: payment.id,
      amount: amount 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}