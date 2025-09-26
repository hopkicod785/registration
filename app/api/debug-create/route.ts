import { NextResponse } from 'next/server';
import { jsonDb } from '@/lib/json-db';

export async function POST() {
  try {
    console.log('Debug: Creating test registration...');
    
    const testData = {
      intersectionName: 'Test Intersection',
      endUser: 'Test User',
      distributor: 'Orange Traffic',
      cabinetType: 'NEMA TS 1',
      cabinetTypeOther: undefined,
      tlsConnection: 'NTCIP',
      tlsConnectionOther: undefined,
      detectionIO: 'DB37 to Spades',
      detectionIOOther: undefined,
      phasingText: 'Test phasing info',
      estimatedInstallDate: '2024-02-15',
      contactName: 'Test Contact',
      contactEmail: 'test@example.com',
      contactPhone: '555-1234',
      phasingFilePath: undefined,
      timingFiles: []
    };

    const result = await jsonDb.createRegistration(testData);
    console.log('Debug: Test registration created:', result);
    
    return NextResponse.json({
      message: 'Test registration created successfully',
      result: result,
      testData: testData
    });
  } catch (error) {
    console.error('Debug create error:', error);
    return NextResponse.json({
      error: 'Debug create failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
