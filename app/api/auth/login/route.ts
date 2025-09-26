import { NextRequest, NextResponse } from 'next/server';
import { jsonDb } from '@/lib/json-db';
import { verifyPassword, generateToken, createSecureCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    console.log('Looking for user:', username);
    const user = await jsonDb.getUserByUsername(username);
    console.log('Found user:', user ? 'Yes' : 'No');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password (simple comparison for now)
    const isValidPassword = password === user.password_hash;
    console.log('Password check:', { provided: password, stored: user.password_hash, valid: isValidPassword });
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // Create response with secure cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', createSecureCookie(token));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
