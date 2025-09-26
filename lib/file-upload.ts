import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];

export interface FileUploadResult {
  success: boolean;
  fileName?: string;
  error?: string;
}

export async function validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG'
    };
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      valid: false,
      error: 'File extension not allowed'
    };
  }

  return { valid: true };
}

export async function saveFile(
  file: File, 
  category: 'phasing' | 'timing',
  customName?: string
): Promise<FileUploadResult> {
  try {
    // Validate file
    const validation = await validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads', category);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileName = customName 
      ? `${customName}_${timestamp}${fileExtension}`
      : `${category}_${timestamp}_${file.name}`;

    // Sanitize filename
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = join(uploadDir, sanitizedFileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return {
      success: true,
      fileName: sanitizedFileName
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'Failed to save file'
    };
  }
}

export async function saveMultipleFiles(
  files: File[],
  category: 'phasing' | 'timing'
): Promise<{ success: boolean; fileNames: string[]; errors: string[] }> {
  const fileNames: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = await saveFile(file, category);
    if (result.success && result.fileName) {
      fileNames.push(result.fileName);
    } else {
      errors.push(`${file.name}: ${result.error || 'Unknown error'}`);
    }
  }

  return {
    success: fileNames.length > 0,
    fileNames,
    errors
  };
}

export function getFileUrl(fileName: string, category: 'phasing' | 'timing'): string {
  return `/uploads/${category}/${fileName}`;
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}
