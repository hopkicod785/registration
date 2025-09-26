import { NextResponse } from 'next/server';
import { createLogoutCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );

  response.headers.set('Set-Cookie', createLogoutCookie());

  return response;
}
