import { Injectable, Logger } from '@nestjs/common';
import { MysqlService } from '../database/mysql.service';

export interface FileRecord {
  file_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: Date;
  is_active: boolean;
}

export interface FileUploadRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  uploadedBy: string;
  filePath: string;
}

export interface FileQueryOptions {
  uploadedBy?: string;
  fileType?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);

  constructor(private readonly mysqlService: MysqlService) {}

  /**
   * Create a new file record
   */
  async createFileRecord(request: FileUploadRequest): Promise<FileRecord> {
    const query = `
      INSERT INTO tb_file (
        file_name, file_path, file_size, file_type, mime_type,
        uploaded_by, uploaded_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
    `;

    const values = [
      request.fileName,
      request.filePath,
      request.fileSize,
      request.fileType,
      request.mimeType,
      request.uploadedBy,
    ];

    try {
      const result = await this.mysqlService.execute(query, values);
      const fileId = result.insertId;

      this.logger.log(`File record created: ${request.fileName} (ID: ${fileId})`);

      // Return the created file record
      return this.getFileById(fileId);
    } catch (error) {
      this.logger.error('Failed to create file record', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(fileId: number): Promise<FileRecord> {
    const query = `
      SELECT
        file_id, file_name, file_path, file_size, file_type,
        mime_type, uploaded_by, uploaded_at, is_active
      FROM tb_file
      WHERE file_id = ? AND is_active = 1
    `;

    try {
      const files = await this.mysqlService.query<FileRecord>(query, [fileId]);

      if (files.length === 0) {
        throw new Error(`File with ID ${fileId} not found`);
      }

      return files[0];
    } catch (error) {
      this.logger.error(`Failed to get file by ID: ${fileId}`, error);
      throw error;
    }
  }

  /**
   * Get files by query options
   */
  async getFiles(options: FileQueryOptions = {}): Promise<FileRecord[]> {
    let query = `
      SELECT
        file_id, file_name, file_path, file_size, file_type,
        mime_type, uploaded_by, uploaded_at, is_active
      FROM tb_file
      WHERE 1=1
    `;

    const params: any[] = [];

    if (options.uploadedBy) {
      query += ' AND uploaded_by = ?';
      params.push(options.uploadedBy);
    }

    if (options.fileType) {
      query += ' AND file_type = ?';
      params.push(options.fileType);
    }

    if (options.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(options.isActive ? 1 : 0);
    }

    query += ' AND is_active = 1 ORDER BY uploaded_at DESC';

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);

      if (options.offset) {
        query += ' OFFSET ?';
        params.push(options.offset);
      }
    }

    try {
      return await this.mysqlService.query<FileRecord>(query, params);
    } catch (error) {
      this.logger.error('Failed to get files', error);
      throw error;
    }
  }

  /**
   * Update file record
   */
  async updateFile(fileId: number, updates: Partial<FileRecord>): Promise<boolean> {
    const allowedFields = ['file_name', 'file_path', 'file_size', 'file_type', 'mime_type'];
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      return false;
    }

    const query = `
      UPDATE tb_file
      SET ${updateFields.join(', ')}
      WHERE file_id = ? AND is_active = 1
    `;

    values.push(fileId);

    try {
      const result = await this.mysqlService.execute(query, values);
      const success = result.affectedRows > 0;

      if (success) {
        this.logger.log(`File record updated: ${fileId}`);
      }

      return success;
    } catch (error) {
      this.logger.error(`Failed to update file: ${fileId}`, error);
      throw error;
    }
  }

  /**
   * Soft delete file record
   */
  async deleteFile(fileId: number): Promise<boolean> {
    const query = `
      UPDATE tb_file
      SET is_active = 0
      WHERE file_id = ? AND is_active = 1
    `;

    try {
      const result = await this.mysqlService.execute(query, [fileId]);
      const success = result.affectedRows > 0;

      if (success) {
        this.logger.log(`File record soft deleted: ${fileId}`);
      }

      return success;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${fileId}`, error);
      throw error;
    }
  }

  /**
   * Get files by uploader
   */
  async getFilesByUploader(uploadedBy: string, limit = 50): Promise<FileRecord[]> {
    return this.getFiles({ uploadedBy, limit });
  }

  /**
   * Get files by type
   */
  async getFilesByType(fileType: string, limit = 50): Promise<FileRecord[]> {
    return this.getFiles({ fileType, limit });
  }

  /**
   * Get total file count for user
   */
  async getFileCountForUser(uploadedBy: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM tb_file
      WHERE uploaded_by = ? AND is_active = 1
    `;

    try {
      const result = await this.mysqlService.query<{ count: number }>(query, [uploadedBy]);
      return result[0]?.count || 0;
    } catch (error) {
      this.logger.error(`Failed to get file count for user: ${uploadedBy}`, error);
      throw error;
    }
  }

  /**
   * Get total storage used by user
   */
  async getStorageUsedByUser(uploadedBy: string): Promise<number> {
    const query = `
      SELECT SUM(file_size) as total_size
      FROM tb_file
      WHERE uploaded_by = ? AND is_active = 1
    `;

    try {
      const result = await this.mysqlService.query<{ total_size: number }>(query, [uploadedBy]);
      return result[0]?.total_size || 0;
    } catch (error) {
      this.logger.error(`Failed to get storage used by user: ${uploadedBy}`, error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: Express.Multer.File, maxSizeMB = 10): {
    isValid: boolean;
    error?: string;
  } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      };
    }

    // Add more validation logic here as needed
    // File type validation, malware scanning, etc.

    return { isValid: true };
  }

  /**
   * Generate file path for storage
   */
  generateFilePath(fileName: string, uploadedBy: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = fileName.split('.').pop();
    return `uploads/${uploadedBy}/${timestamp}_${random}.${extension}`;
  }

  /**
   * Check if file exists
   */
  async fileExists(fileId: number): Promise<boolean> {
    const query = `
      SELECT 1
      FROM tb_file
      WHERE file_id = ? AND is_active = 1
      LIMIT 1
    `;

    try {
      const result = await this.mysqlService.query(query, [fileId]);
      return result.length > 0;
    } catch (error) {
      this.logger.error(`Failed to check if file exists: ${fileId}`, error);
      return false;
    }
  }
}
