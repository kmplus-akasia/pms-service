import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Temporary enum definitions to fix import issues
enum KpiType {
  IMPACT = 'IMPACT',
  OUTPUT = 'OUTPUT',
  SUB_IMPACT = 'SUB_IMPACT',
  KAI = 'KAI',
}

enum Polarity {
  NEUTRAL = 'NEUTRAL',
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

enum TargetType {
  FIXED = 'FIXED',
  PROGRESSIVE = 'PROGRESSIVE',
}

enum CascadingMethod {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
}

enum ItemApprovalStatus {
  DRAFT = 'DRAFT',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  REJECTED = 'REJECTED',
  READY = 'READY',
  APPROVED = 'APPROVED',
}

enum OwnershipType {
  OWNER = 'OWNER',
  SHARED_OWNER = 'SHARED_OWNER',
  COLLABORATOR = 'COLLABORATOR',
}

export enum KpiStatus {
  DRAFT = 'DRAFT',
  CASCADING_PENDING_REVIEW = 'CASCADING_PENDING_REVIEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum MonitoringStatus {
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  BEHIND = 'BEHIND',
  PENDING = 'PENDING',
}

export class KpiOwnerDto {
  @ApiProperty({
    description: 'Employee number',
    example: 'EMP001',
  })
  employeeNumber: string;

  @ApiProperty({
    description: 'Employee name',
    example: 'John Doe',
  })
  employeeName: string;

  @ApiProperty({
    description: 'Ownership type',
    enum: OwnershipType,
    example: OwnershipType.OWNER,
  })
  ownershipType: OwnershipType;

  @ApiProperty({
    description: 'Weight percentage',
    example: 100,
  })
  weight: number;
}

export class KpiProgressDto {
  @ApiProperty({
    description: 'Period identifier',
    example: '2026-01',
  })
  period: string;

  @ApiProperty({
    description: 'Target value for this period',
    example: 50000,
  })
  target: number;

  @ApiPropertyOptional({
    description: 'Actual/realized value',
    example: 48500,
  })
  actual?: number;

  @ApiPropertyOptional({
    description: 'Achievement percentage',
    example: 97.0,
  })
  achievement?: number;

  @ApiProperty({
    description: 'Status',
    enum: MonitoringStatus,
    example: MonitoringStatus.ON_TRACK,
  })
  status: MonitoringStatus;
}

export class KpiResponseDto {
  @ApiProperty({
    description: 'Unique KPI identifier',
    example: 123,
  })
  kpiId: number;

  @ApiProperty({
    description: 'KPI title',
    example: 'Container Throughput Terminal Nilam',
  })
  title: string;

  @ApiProperty({
    description: 'KPI description',
    example: 'Total volume of containers handled at Terminal Nilam',
  })
  description: string;

  @ApiProperty({
    description: 'KPI type',
    enum: KpiType,
    example: KpiType.OUTPUT,
  })
  type: KpiType;

  @ApiProperty({
    description: 'Target value',
    example: 50000,
  })
  targetValue: number;

  @ApiProperty({
    description: 'Target unit',
    example: 'TEUs',
  })
  targetUnit: string;

  @ApiProperty({
    description: 'Target type',
    enum: TargetType,
    example: TargetType.FIXED,
  })
  targetType: TargetType;

  @ApiProperty({
    description: 'Polarity',
    enum: Polarity,
    example: Polarity.POSITIVE,
  })
  polarity: Polarity;

  @ApiProperty({
    description: 'Cascading method',
    enum: CascadingMethod,
    example: CascadingMethod.INDIRECT,
  })
  cascadingMethod: CascadingMethod;

  @ApiProperty({
    description: 'Weight percentage',
    example: 30,
  })
  weight: number;

  @ApiProperty({
    description: 'Current status',
    enum: KpiStatus,
    example: KpiStatus.APPROVED,
  })
  status: KpiStatus;

  @ApiProperty({
    description: 'Overall monitoring status',
    enum: MonitoringStatus,
    example: MonitoringStatus.ON_TRACK,
  })
  monitoringStatus: MonitoringStatus;

  @ApiProperty({
    description: 'Current achievement percentage',
    example: 85.5,
  })
  currentAchievement: number;

  @ApiProperty({
    description: 'Weighted score',
    example: 25.65,
  })
  weightedScore: number;

  @ApiProperty({
    description: 'Year-to-date achievement',
    example: 87.2,
  })
  ytdAchievement: number;

  @ApiProperty({
    description: 'KPI owner information',
    type: KpiOwnerDto,
  })
  owner: KpiOwnerDto;

  @ApiProperty({
    description: 'Progress data by period',
    type: [KpiProgressDto],
  })
  progress: KpiProgressDto[];

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-20T14:45:00Z',
  })
  updatedAt: Date;

  // Optional fields based on KPI type
  @ApiPropertyOptional({
    description: 'BSC Perspective (for OUTPUT type)',
    example: 'CUSTOMER',
  })
  bscPerspective?: string;

  @ApiPropertyOptional({
    description: 'Nature of Work (for KAI type)',
    example: 'ROUTINE',
  })
  natureOfWork?: string;

  @ApiPropertyOptional({
    description: 'Monitoring Frequency (for KAI type)',
    example: 'MONTHLY',
  })
  monitoringFrequency?: string;

  @ApiPropertyOptional({
    description: 'Linked KPI Output ID (for KAI type)',
    example: 456,
  })
  linkedKpiOutputId?: number;

  @ApiPropertyOptional({
    description: 'From KPI Dictionary',
    example: false,
  })
  fromDictionary?: boolean;

  @ApiPropertyOptional({
    description: 'KPI Dictionary ID',
    example: 'dict_123',
  })
  dictionaryId?: string;

  @ApiPropertyOptional({
    description: 'Parent KPI ID (for cascading)',
    example: 789,
  })
  parentKpiId?: number;

  @ApiPropertyOptional({
    description: 'Child KPI IDs (for cascading)',
    type: [Number],
    example: [101, 102],
  })
  childKpiIds?: number[];
}
