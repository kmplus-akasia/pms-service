import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

/**
 * Approve KPI Item DTO
 * US-MT-003: Approve KPI Item (Per-Item)
 */
export class ApproveKpiItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  kpiId: number;

  @ApiProperty({ example: 'Approved by manager', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

/**
 * Reject KPI Item DTO
 * US-MT-004: Reject KPI Item dengan Catatan
 */
export class RejectKpiItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  kpiId: number;

  @ApiProperty({ example: 'Target terlalu tinggi, mohon adjust ke 110', description: 'Mandatory rejection notes (min 20 chars)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(20, { message: 'Rejection notes must be at least 20 characters' })
  @MaxLength(500)
  rejectionNotes: string;

  @ApiProperty({ example: ['target', 'description'], required: false, description: 'Fields that need revision' })
  @IsArray()
  @IsOptional()
  fieldsToRevise?: string[];
}

/**
 * Request Clarification DTO
 * US-MT-005: Request Clarification KPI
 */
export class RequestClarificationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  kpiId: number;

  @ApiProperty({ example: 'Mohon jelaskan lebih detail mengenai target yang ditetapkan' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Clarification question must be at least 10 characters' })
  @MaxLength(500)
  clarificationQuestion: string;
}

/**
 * Approve Final Portfolio DTO
 * US-MT-006: Approve Final KPI Portfolio
 */
export class ApproveFinalPortfolioDto {
  @ApiProperty({ example: '12345', description: 'Employee number of subordinate' })
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @ApiProperty({ example: 'Portfolio approved, ready for monitoring', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

/**
 * Reject Final Portfolio DTO
 * US-MT-007: Reject Final KPI Portfolio
 */
export class RejectFinalPortfolioDto {
  @ApiProperty({ example: '12345', description: 'Employee number of subordinate' })
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @ApiProperty({ example: 'Bobot KPI Output tidak seimbang, mohon revisi' })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(1000)
  rejectionNotes: string;

  @ApiProperty({ example: [1, 2, 3], required: false, description: 'KPI IDs that need revision' })
  @IsArray()
  @IsOptional()
  kpiIdsToRevise?: number[];
}

/**
 * Approve Realization DTO
 * US-MT-008: Approve Realisasi Bawahan
 */
export class ApproveRealizationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  realizationId: number;

  @ApiProperty({ example: 'Evidence valid, realization approved', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

/**
 * Reject Realization DTO
 * US-MT-009: Reject Realisasi dengan Catatan
 */
export class RejectRealizationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  realizationId: number;

  @ApiProperty({ example: 'Evidence tidak sesuai dengan target, mohon upload dokumen yang benar' })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(500)
  rejectionNotes: string;
}

/**
 * Adjust and Approve Realization DTO
 * US-MT-010: Adjust dan Approve Realisasi
 */
export class AdjustAndApproveRealizationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  realizationId: number;

  @ApiProperty({ example: 105, description: 'Adjusted actual value' })
  @IsNumber()
  @IsNotEmpty()
  adjustedValue: number;

  @ApiProperty({ example: 'Koreksi error input dari 100 menjadi 105 berdasarkan dokumen evidence' })
  @IsString()
  @IsNotEmpty()
  @MinLength(20, { message: 'Adjustment justification must be at least 20 characters' })
  @MaxLength(500)
  adjustmentJustification: string;
}

/**
 * Bulk Approve Realizations DTO
 * US-MT-020: Bulk Approve Realisasi
 */
export class BulkApproveRealizationsDto {
  @ApiProperty({ example: [1, 2, 3, 4, 5], description: 'Array of realization IDs to approve (max 50)' })
  @IsArray()
  @IsNotEmpty()
  realizationIds: number[];

  @ApiProperty({ example: 'Bulk approval for monthly realizations', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

/**
 * Approval Response DTO
 */
export class ApprovalResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'KPI approved successfully' })
  message: string;

  @ApiProperty({ example: 1, required: false })
  itemId?: number;

  @ApiProperty({ example: 'Approved', required: false })
  newStatus?: string;

  @ApiProperty({ example: '2026-01-15T10:30:00Z', required: false })
  approvedAt?: Date;
}

/**
 * Bulk Approval Response DTO
 */
export class BulkApprovalResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Bulk approval completed' })
  message: string;

  @ApiProperty({ example: 5, description: 'Number of successfully approved items' })
  successCount: number;

  @ApiProperty({ example: 0, description: 'Number of failed items' })
  failureCount: number;

  @ApiProperty({ example: [], required: false, description: 'List of failed item IDs with reasons' })
  failures?: Array<{ itemId: number; reason: string }>;
}

