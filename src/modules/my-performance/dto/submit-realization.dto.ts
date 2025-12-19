import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  Length,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum RealizationType {
  KPI_OUTPUT = 'KPI_OUTPUT',
  KAI = 'KAI',
}

export class EvidenceDto {
  @ApiProperty({
    description: 'Evidence file ID from file storage',
    example: 123,
  })
  @IsNumber()
  fileId: number;

  @ApiProperty({
    description: 'Evidence description',
    example: 'Monthly throughput report',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @Length(1, 200)
  description: string;
}

export class SubmitRealizationDto {
  @ApiProperty({
    description: 'KPI ID',
    example: 123,
  })
  @IsNumber()
  kpiId: number;

  @ApiProperty({
    description: 'Realization type',
    enum: RealizationType,
    example: RealizationType.KPI_OUTPUT,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(RealizationType))
  type: RealizationType;

  @ApiProperty({
    description: 'Actual/realized value',
    example: 48500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  actualValue: number;

  @ApiPropertyOptional({
    description: 'Period for realization (YYYY-MM for monthly, YYYY-QN for quarterly)',
    example: '2026-01',
  })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({
    description: 'Week number (for KAI Weekly)',
    example: 5,
    minimum: 1,
    maximum: 52,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(52)
  week?: number;

  @ApiPropertyOptional({
    description: 'Month number (for KAI Monthly)',
    example: 1,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({
    description: 'Quarter number',
    example: 1,
    minimum: 1,
    maximum: 4,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  quarter?: number;

  @ApiProperty({
    description: 'Year',
    example: 2026,
    minimum: 2020,
    maximum: 2030,
  })
  @IsNumber()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiPropertyOptional({
    description: 'Notes/comments about the realization',
    example: 'Exceeded target due to additional shipments',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @ApiProperty({
    description: 'Evidence files (at least one required)',
    type: [EvidenceDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EvidenceDto)
  evidence: EvidenceDto[];
}
