import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the admin auth cookie
  cookies().delete('admin_auth');
  
  return NextResponse.json({ message: 'Logged out successfully' });
}