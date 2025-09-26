import { NextRequest, NextResponse } from 'next/server';
import { dbFunctions } from '@/lib/database';
import { RegistrationSchema } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { saveFile, saveMultipleFiles } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const data = {
      intersectionName: formData.get('intersectionName') as string,
      endUser: formData.get('endUser') as string,
      distributor: formData.get('distributor') as string,
      cabinetType: formData.get('cabinetType') as string,
      cabinetTypeOther: formData.get('cabinetTypeOther') as string,
      tlsConnection: formData.get('tlsConnection') as string,
      tlsConnectionOther: formData.get('tlsConnectionOther') as string,
      detectionIO: formData.get('detectionIO') as string,
      detectionIOOther: formData.get('detectionIOOther') as string,
      phasingText: formData.get('phasingText') as string,
      contactName: formData.get('contactName') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
    };

    // Validate data
    const validationResult = RegistrationSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Handle file uploads
    const phasingFile = formData.get('phasingFile') as File;
    const timingFiles = formData.getAll('timingFiles') as File[];
    
    let phasingFilePath = null;
    let timingFilePaths: string[] = [];

    // Save phasing file if provided
    if (phasingFile && phasingFile.size > 0) {
      const result = await saveFile(phasingFile, 'phasing');
      if (result.success && result.fileName) {
        phasingFilePath = result.fileName;
      } else {
        return NextResponse.json(
          { error: `Phasing file upload failed: ${result.error}` },
          { status: 400 }
        );
      }
    }

    // Save timing files if provided
    if (timingFiles.length > 0) {
      const validFiles = timingFiles.filter(file => file && file.size > 0);
      if (validFiles.length > 0) {
        const result = await saveMultipleFiles(validFiles, 'timing');
        timingFilePaths = result.fileNames;
        
        if (result.errors.length > 0) {
          console.warn('Some timing files failed to upload:', result.errors);
        }
      }
    }

    // Create registration
    const registrationData = {
      ...data,
      phasingFilePath,
      timingFiles: timingFilePaths
    };

    const result = await dbFunctions.createRegistration(registrationData);

    return NextResponse.json(
      { 
        message: 'Registration created successfully',
        id: result.lastInsertRowid
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const registrations = await dbFunctions.getAllRegistrations();
    
    return NextResponse.json(
      { registrations },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
