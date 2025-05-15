import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/models';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const amount = searchParams.get('amount');
    
    if (!userId || !amount) {
      return NextResponse.json({ message: 'User ID and amount are required' }, { status: 400 });
    }
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    
    // Verify the user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // UPI payment details - replace with your actual UPI ID
    const merchantUpiId = '7987925858@ibl'; // Replace with your actual UPI ID
    const merchantName = 'Cricket Registration';
    const transactionNote = 'Registration Fee';
    
    // Construct UPI URL
    const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(upiUrl);
    
    // Return QR code as image (data URL)
    return new NextResponse(qrCodeDataUrl, {
      headers: {
        'Content-Type': 'text/plain',
      },
      status: 200,
    });
    
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json({ message: 'Failed to generate QR code' }, { status: 500 });
  }
}