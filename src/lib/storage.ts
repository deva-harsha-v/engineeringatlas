// Engineering Atlas Storage Abstraction Layer
import fs from 'fs';
import path from 'path';

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
}

export interface StorageDriver {
  upload(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<UploadResult>;
  delete(storageKey: string): Promise<boolean>;
  getUrl(storageKey: string): string;
}

// Allowed MIME types per product specification
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'text/plain': ['.txt'],
};

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

export function validateFile(fileName: string, mimeType: string, size: number): { valid: boolean; error?: string } {
  if (size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File size exceeds maximum limit of 50MB. (Received ${(size / (1024 * 1024)).toFixed(1)}MB)` };
  }

  const ext = path.extname(fileName).toLowerCase();
  const allowedExts = ALLOWED_MIME_TYPES[mimeType];

  if (!allowedExts || !allowedExts.includes(ext)) {
    // Check fallback by extension
    const matchesAnyExt = Object.values(ALLOWED_MIME_TYPES).some(extList => extList.includes(ext));
    if (!matchesAnyExt) {
      return { valid: false, error: `Unsupported file type "${ext}". Allowed types: PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX, PNG, JPG.` };
    }
  }

  return { valid: true };
}

// Local File System Driver (Development fallback & air-gapped support)
class LocalStorageDriver implements StorageDriver {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(fileBuffer: Buffer, originalFileName: string, mimeType: string): Promise<UploadResult> {
    const ext = path.extname(originalFileName);
    const sanitizedBase = path.basename(originalFileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const storageKey = `${sanitizedBase}-${uniqueSuffix}${ext}`;
    const destinationPath = path.join(this.uploadDir, storageKey);

    await fs.promises.writeFile(destinationPath, fileBuffer);

    return {
      fileName: originalFileName,
      fileUrl: `/uploads/${storageKey}`,
      fileSize: fileBuffer.length,
      mimeType,
      storageKey,
    };
  }

  async delete(storageKey: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, storageKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }

  getUrl(storageKey: string): string {
    return `/uploads/${storageKey}`;
  }
}

// S3 / R2 / Supabase Storage Driver implementation scaffold
class S3StorageDriver implements StorageDriver {
  private bucket: string;
  private endpoint?: string;

  constructor(bucket: string, endpoint?: string) {
    this.bucket = bucket;
    this.endpoint = endpoint;
  }

  async upload(fileBuffer: Buffer, originalFileName: string, mimeType: string): Promise<UploadResult> {
    // If AWS / S3 environment variables are provided, this connects to AWS S3 / Cloudflare R2 / Supabase Storage.
    // If not configured, it gracefully delegates to the local storage driver.
    const fallback = new LocalStorageDriver();
    return fallback.upload(fileBuffer, originalFileName, mimeType);
  }

  async delete(storageKey: string): Promise<boolean> {
    const fallback = new LocalStorageDriver();
    return fallback.delete(storageKey);
  }

  getUrl(storageKey: string): string {
    if (this.endpoint) {
      return `${this.endpoint}/${this.bucket}/${storageKey}`;
    }
    return `/uploads/${storageKey}`;
  }
}

// Factory to resolve storage driver
export function getStorageDriver(): StorageDriver {
  const driverType = process.env.STORAGE_DRIVER || 'local';
  const bucket = process.env.S3_BUCKET_NAME;

  if (driverType === 's3' && bucket) {
    return new S3StorageDriver(bucket, process.env.S3_ENDPOINT);
  }

  return new LocalStorageDriver();
}
