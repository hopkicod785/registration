import { NextResponse } from 'next/server';
import { jsonDb } from '@/lib/json-db';

export async function GET() {
  try {
    console.log('Debug: Fetching all registrations...');
    const registrations = await jsonDb.getAllRegistrations();
    console.log('Debug: Found registrations:', registrations.length);
    console.log('Debug: Registrations data:', registrations);
    
    return NextResponse.json({
      count: registrations.length,
      registrations: registrations,
      debug: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
