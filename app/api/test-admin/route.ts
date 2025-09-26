import { NextResponse } from 'next/server';
import { jsonDb } from '@/lib/json-db';

export async function GET() {
  try {
    const user = await jsonDb.getUserByUsername('admin');
    return NextResponse.json({
      adminExists: !!user,
      user: user ? { username: user.username, role: user.role } : null
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check admin user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
