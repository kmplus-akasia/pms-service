import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsArray, IsOptional, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { MonitoringPeriod, NatureOfWork } from 'src/infrastructure/database/entities/kpi.entity';

/**
 * Cascade Method Enum
 */
export enum CascadeMethod {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
}

/**
 * Cascade Recipient Configuration
 */
export class CascadeRecipientDto {
  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @ApiProperty({ example: 100, description: 'Target value for this recipient' })
  @IsNumber()
  @IsNotEmpty()
  targetValue: number;

  @ApiProperty({ example: 20, description: 'Weight percentage for this KPI in recipient portfolio' })
  @IsNumber()
  @IsNotEmpty()
  weight: number;
}

/**
 * Cascade KPI to Subordinates DTO
 * US-MT-012: Cascade KPI ke Bawahan (Direct)
 * US-MT-013: Cascade KPI ke Bawahan (Indirect)
 */
export class CascadeKpiDto {
  @ApiProperty({ example: 1, description: 'Parent KPI ID to cascade' })
  @IsNumber()
  @IsNotEmpty()
  parentKpiId: number;

  @ApiProperty({ enum: CascadeMethod, example: CascadeMethod.DIRECT })
  @IsEnum(CascadeMethod)
  @IsNotEmpty()
  cascadeMethod: CascadeMethod;

  @ApiProperty({ type: [CascadeRecipientDto], description: 'List of recipients with their configurations' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CascadeRecipientDto)
  recipients: CascadeRecipientDto[];

  @ApiProperty({ example: 'Cascading Q1 revenue target to team', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

/**
 * Draft KPI for Subordinate DTO
 * US-MT-011: Draft KPI untuk Bawahan
 */
export class DraftKpiForSubordinateDto {
  @ApiProperty({ example: '12345', description: 'Employee number of subordinate' })
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @ApiProperty({ example: 'Revenue Growth Q1', description: 'KPI title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Increase revenue by 20% compared to previous quarter' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ example: 'OUTPUT', enum: ['OUTPUT', 'KAI'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  targetValue: number;

  @ApiProperty({ example: 'Million IDR' })
  @IsString()
  @IsNotEmpty()
  targetUnit: string;

  @ApiProperty({ example: 20, description: 'Weight percentage' })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: 'FIXED', enum: ['FIXED', 'PROGRESSIVE'] })
  @IsString()
  @IsNotEmpty()
  targetType: string;

  @ApiProperty({ example: 'MAXIMIZE', enum: ['MAXIMIZE', 'MINIMIZE'] })
  @IsString()
  @IsNotEmpty()
  polarity: string;

  @ApiProperty({ example: 'Financial' })
  @IsString()
  @IsNotEmpty()
  bscPerspective: string;

  @ApiProperty({ example: 'MONTHLY', enum: ['MONTHLY', 'QUARTERLY'] })
  @IsString()
  @IsNotEmpty()
  monitoringFrequency: string;
}

/**
 * Draft KAI for Subordinate DTO
 * US-MT-024: Draft KAI untuk Bawahan dari KPI Output Bawahan
 */
export class DraftKaiForSubordinateDto {
  @ApiProperty({ example: '12345', description: 'Employee number of subordinate' })
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @ApiProperty({ example: 1, description: 'KPI Output ID to link this KAI to (must belong to subordinate)' })
  @IsNumber()
  @IsNotEmpty()
  linkedKpiOutputId: number;

  @ApiProperty({ example: 'Weekly Team Meeting' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Conduct weekly team meeting to discuss progress' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ example: 4, description: 'Target value (e.g., 4 meetings per month)' })
  @IsNumber()
  @IsNotEmpty()
  targetValue: number;

  @ApiProperty({ example: 'Meetings' })
  @IsString()
  @IsNotEmpty()
  targetUnit: string;

  @ApiProperty({ example: 15, description: 'Weight percentage' })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: 'ROUTINE', enum: ['ROUTINE', 'NON_ROUTINE'] })
  @IsString()
  @IsNotEmpty()
  natureOfWork: NatureOfWork;

  @ApiProperty({ example: MonitoringPeriod.WEEKLY, enum: MonitoringPeriod })
  @IsString()
  @IsNotEmpty()
  monitoringFrequency: string;
}

/**
 * Cascade Review Status Response
 * US-MT-025: Monitor Cascaded KPI Review Status
 */
export class CascadedKpiReviewStatusDto {
  @ApiProperty({ example: 1 })
  kpiId: number;

  @ApiProperty({ example: 'Revenue Growth Q1' })
  kpiTitle: string;

  @ApiProperty({ example: '12345' })
  recipientEmployeeNumber: string;

  @ApiProperty({ example: 'Ahmad Dani' })
  recipientName: string;

  @ApiProperty({ example: '2026-01-15T08:00:00Z' })
  cascadedDate: Date;

  @ApiProperty({ example: 'PENDING_REVIEW', enum: ['PENDING_REVIEW', 'ACCEPTED', 'REVISION_REQUESTED', 'EXPIRED'] })
  reviewStatus: string;

  @ApiProperty({ example: 5, description: 'Days left until auto-accept', required: false })
  daysLeft?: number;

  @ApiProperty({ example: 'Target terlalu tinggi untuk periode ini', required: false })
  revisionNotes?: string;
}

/**
 * Respond to Cascade Revision Request DTO
 */
export class RespondToCascadeRevisionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  kpiId: number;

  @ApiProperty({ example: 'ADJUST', enum: ['ADJUST', 'EXPLAIN', 'WITHDRAW'] })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ example: 'Adjusted target based on feedback', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  responseNotes?: string;

  @ApiProperty({ example: 110, required: false, description: 'New target value if action is ADJUST' })
  @IsNumber()
  @IsOptional()
  newTargetValue?: number;
}

