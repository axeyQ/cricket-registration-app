import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User, Payment } from '@/models';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'address', 'whatsappNumber', 'dateOfBirth', 'bowlingHand', 'battingHand'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }
    
    // Create the user
    const user = await User.create({
      name: data.name,
      address: data.address,
      whatsappNumber: data.whatsappNumber,
      dateOfBirth: new Date(data.dateOfBirth),
      bowlingHand: data.bowlingHand,
      battingHand: data.battingHand,
    });
    
    // Create a pending payment record
    const amount = 300; // Registration fee amount
    const payment = await Payment.create({
      userId: user._id,
      amount: amount,
      status: 'pending',
    });
    
    return NextResponse.json({ 
      message: 'Registration successful', 
      userId: user._id,
      paymentId: payment._id,
      amount: amount 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}