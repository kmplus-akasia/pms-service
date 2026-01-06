import { ApiProperty } from '@nestjs/swagger';

/**
 * Team Member Summary for Dashboard
 * US-MT-001: View Team Dashboard
 */
export class TeamMemberSummaryDto {
  @ApiProperty({ example: '12345' })
  employeeNumber: string;

  @ApiProperty({ example: 'Ahmad Dani' })
  employeeName: string;

  @ApiProperty({ example: 'Officer Kinerja Individu' })
  positionName: string;

  @ApiProperty({ example: 'BOD-5' })
  levelBod: string;

  @ApiProperty({ example: 'Cohort A' })
  cohortName: string;

  @ApiProperty({ example: 102.5, description: 'Current performance score' })
  currentScore: number;

  @ApiProperty({ example: 'success', enum: ['success', 'warning', 'danger'] })
  scoreColor: string;

  @ApiProperty({ example: 3, description: 'Number of pending approval items' })
  pendingApprovalCount: number;

  @ApiProperty({ example: 1, description: 'Number of KPIs at risk' })
  atRiskCount: number;

  @ApiProperty({ example: false, description: 'Has multiple positions (definitif + secondary)' })
  hasMultiPosition: boolean;

  @ApiProperty({ example: '2026-01-15T08:00:00Z', description: 'Last activity timestamp' })
  lastActivity: Date;
}

/**
 * Team Dashboard Summary Cards
 * US-MT-001: View Team Dashboard
 */
export class TeamSummaryDto {
  @ApiProperty({ example: 15, description: 'Total team members' })
  totalMembers: number;

  @ApiProperty({ example: 98.5, description: 'Average team score' })
  averageScore: number;

  @ApiProperty({ example: 12, description: 'Total pending approval items' })
  pendingApprovalCount: number;

  @ApiProperty({ example: 3, description: 'Total KPIs at risk across team' })
  atRiskCount: number;

  @ApiProperty({ example: 2, description: 'Members with score < 80%' })
  membersAtRisk: number;

  @ApiProperty({ example: 8, description: 'Members with score >= 100%' })
  membersOnTrack: number;

  @ApiProperty({ example: 5, description: 'Members with score 80-99%' })
  membersBehind: number;
}

/**
 * Team Dashboard Response
 * US-MT-001: View Team Dashboard
 */
export class TeamDashboardResponseDto {
  @ApiProperty({ type: TeamSummaryDto })
  summary: TeamSummaryDto;

  @ApiProperty({ type: [TeamMemberSummaryDto] })
  members: TeamMemberSummaryDto[];

  @ApiProperty({ example: '2026-01' })
  currentPeriod: string;
}

