import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Find the admin user
    const admin = await prisma.admin.findUnique({
      where: { username },
    });
    
    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    // Create a JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Set the token as an HTTP-only cookie
    cookies().set({
      name: 'admin_auth',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
    return NextResponse.json({ message: 'Login successful' });
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}