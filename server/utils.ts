import fs from 'fs';
import path from 'path';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function isValidMimeType(mimeType: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'image/svg+xml',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/postscript'
  ];
  return allowedTypes.includes(mimeType);
}

export function parseFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function createSuccessResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message: message || 'Operation completed successfully'
  };
}

export function createErrorResponse(error: string, code?: number) {
  return {
    success: false,
    error,
    code: code || 500
  };
}

export function validateRequired(obj: any, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!obj[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}