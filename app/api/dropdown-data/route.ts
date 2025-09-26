import { NextResponse } from 'next/server';
import { dbFunctions } from '@/lib/database';

export async function GET() {
  try {
    const distributors = dbFunctions.getDistributors();
    const cabinetTypes = dbFunctions.getCabinetTypes();
    const tlsConnections = dbFunctions.getTLSConnections();
    const detectionIOs = dbFunctions.getDetectionIOs();

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
