import { NextResponse } from 'next/server';
import { jsonDb } from '@/lib/json-db';

export async function GET() {
  try {
    const distributors = await jsonDb.getDistributors();
    const cabinetTypes = await jsonDb.getCabinetTypes();
    const tlsConnections = await jsonDb.getTLSConnections();
    const detectionIOs = await jsonDb.getDetectionIOs();

    return NextResponse.json({
      distributors,
      cabinetTypes,
      tlsConnections,
      detectionIOs
    });
  } catch (error) {
    console.error('Dropdown data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dropdown data' },
      { status: 500 }
    );
  }
}
