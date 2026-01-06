import { ApiProperty } from '@nestjs/swagger';
import { KpiResponseDto } from '../../my-performance/dto/kpi-response.dto';

/**
 * Member Performance Detail
 * US-MT-002: View Member Performance Detail
 */
export class MemberPerformanceDetailDto {
  @ApiProperty({ example: '12345' })
  employeeNumber: string;

  @ApiProperty({ example: 'Ahmad Dani' })
  employeeName: string;

  @ApiProperty({ example: '12345' })
  nipp: string;

  @ApiProperty({ example: 'Officer Kinerja Individu' })
  positionName: string;

  @ApiProperty({ example: 'BOD-5' })
  levelBod: string;

  @ApiProperty({ example: 'Cohort A' })
  cohortName: string;

  @ApiProperty({ example: 102.5 })
  currentScore: number;

  @ApiProperty({ example: 85.5, description: 'Impact score' })
  impactScore: number;

  @ApiProperty({ example: 78.2, description: 'Output score' })
  outputScore: number;

  @ApiProperty({ example: 92.1, description: 'KAI score' })
  kaiScore: number;

  @ApiProperty({ type: [KpiResponseDto], description: 'List of member KPIs' })
  kpis: KpiResponseDto[];

  @ApiProperty({ example: 3, description: 'Pending approval items' })
  pendingApprovalCount: number;

  @ApiProperty({ example: 1, description: 'At risk KPIs' })
  atRiskCount: number;

  @ApiProperty({ example: false })
  hasMultiPosition: boolean;

  @ApiProperty({ example: '2026-01' })
  currentPeriod: string;
}

