import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsNumber,
  Min,
  Max,
  Length,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export enum KpiType {
  IMPACT = 'IMPACT',
  OUTPUT = 'OUTPUT',
  KAI = 'KAI',
}

export enum NatureOfWork {
  ROUTINE = 'ROUTINE',
  NON_ROUTINE = 'NON_ROUTINE',
}

export enum Polarity {
  MAXIMIZE = 'MAXIMIZE',
  MINIMIZE = 'MINIMIZE',
}

export enum TargetType {
  FIXED = 'FIXED',
  PROGRESSIVE = 'PROGRESSIVE',
}

export enum CascadingMethod {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
}

export enum BscPerspective {
  FINANCIAL = 'FINANCIAL',
  CUSTOMER = 'CUSTOMER',
  INTERNAL_PROCESS = 'INTERNAL_PROCESS',
  LEARNING_GROWTH = 'LEARNING_GROWTH',
}

export enum MonitoringFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export class CreateKpiDto {
  @ApiProperty({
    description: 'KPI title/name',
    example: 'Container Throughput Terminal Nilam',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Detailed KPI description',
    example: 'Total volume of containers handled at Terminal Nilam',
    minLength: 1,
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  description: string;

  @ApiProperty({
    description: 'KPI type',
    enum: KpiType,
    example: KpiType.OUTPUT,
  })
  @IsNotEmpty()
  @IsIn(Object.values(KpiType))
  type: KpiType;

  @ApiProperty({
    description: 'Target value for the KPI',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  targetValue: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'TEUs',
    minLength: 1,
    maxLength: 25,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  targetUnit: string;

  @ApiProperty({
    description: 'Target type (Fixed or Progressive)',
    enum: TargetType,
    example: TargetType.FIXED,
  })
  @IsNotEmpty()
  @IsIn(Object.values(TargetType))
  targetType: TargetType;

  @ApiProperty({
    description: 'Polarity (Maximize or Minimize)',
    enum: Polarity,
    example: Polarity.MAXIMIZE,
  })
  @IsNotEmpty()
  @IsIn(Object.values(Polarity))
  polarity: Polarity;

  @ApiProperty({
    description: 'Cascading method',
    enum: CascadingMethod,
    example: CascadingMethod.INDIRECT,
  })
  @IsNotEmpty()
  @IsIn(Object.values(CascadingMethod))
  cascadingMethod: CascadingMethod;

  @ApiProperty({
    description: 'Weight/Bobot (1-100%)',
    example: 30,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  weight: number;

  // For OUTPUT type KPIs
  @ApiPropertyOptional({
    description: 'BSC Perspective (required for OUTPUT type)',
    enum: BscPerspective,
    example: BscPerspective.CUSTOMER,
  })
  @IsOptional()
  @IsIn(Object.values(BscPerspective))
  bscPerspective?: BscPerspective;

  // For KAI type KPIs
  @ApiPropertyOptional({
    description: 'Nature of Work (required for KAI type)',
    enum: NatureOfWork,
    example: NatureOfWork.ROUTINE,
  })
  @IsOptional()
  @IsIn(Object.values(NatureOfWork))
  natureOfWork?: NatureOfWork;

  @ApiPropertyOptional({
    description: 'Monitoring Frequency (required for KAI type)',
    enum: MonitoringFrequency,
    example: MonitoringFrequency.MONTHLY,
  })
  @IsOptional()
  @IsIn(Object.values(MonitoringFrequency))
  monitoringFrequency?: MonitoringFrequency;

  // Optional fields
  @ApiPropertyOptional({
    description: 'Link to KPI Output (for KAI type)',
    example: 'kpi_123',
  })
  @IsOptional()
  @IsString()
  linkedKpiOutputId?: string;

  @ApiPropertyOptional({
    description: 'From KPI Dictionary',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  fromDictionary?: boolean = false;

  @ApiPropertyOptional({
    description: 'KPI Dictionary ID (if from dictionary)',
    example: 'dict_123',
  })
  @IsOptional()
  @IsString()
  dictionaryId?: string;

  // Progressive targets (if targetType = PROGRESSIVE)
  @ApiPropertyOptional({
    description: 'Progressive targets by period (if targetType = PROGRESSIVE). Object with period keys (e.g., "2026-Q1") and target values.',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      period1: 45000,
      period2: 48000,
      period3: 52000,
      period4: 55000,
    },
  })
  @IsOptional()
  progressiveTargets?: Record<string, number>;
}
