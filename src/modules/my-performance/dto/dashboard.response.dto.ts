import { ApiProperty } from '@nestjs/swagger';
import { KpiResponseDto, MonitoringStatus } from './kpi-response.dto';

export enum PeriodType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export class ScoreBreakdownDto {
  @ApiProperty({
    description: 'KPI Impact score',
    example: 85.5,
  })
  impactScore: number;

  @ApiProperty({
    description: 'KPI Output score',
    example: 78.2,
  })
  outputScore: number;

  @ApiProperty({
    description: 'KAI score',
    example: 92.1,
  })
  kaiScore: number;

  @ApiProperty({
    description: 'Final performance score',
    example: 83.6,
  })
  finalScore: number;
}

export class StatusSummaryDto {
  @ApiProperty({
    description: 'Total KPIs',
    example: 12,
  })
  total: number;

  @ApiProperty({
    description: 'Draft KPIs',
    example: 3,
  })
  draft: number;

  @ApiProperty({
    description: 'Pending approval KPIs',
    example: 2,
  })
  pendingApproval: number;

  @ApiProperty({
    description: 'Approved KPIs',
    example: 5,
  })
  approved: number;

  @ApiProperty({
    description: 'Rejected KPIs',
    example: 1,
  })
  rejected: number;

  @ApiProperty({
    description: 'On track KPIs',
    example: 4,
  })
  onTrack: number;

  @ApiProperty({
    description: 'At risk KPIs',
    example: 2,
  })
  atRisk: number;

  @ApiProperty({
    description: 'Behind KPIs',
    example: 1,
  })
  behind: number;

  @ApiProperty({
    description: 'Pending realization KPIs',
    example: 3,
  })
  pending: number;
}

export class ProgressIndicatorDto {
  @ApiProperty({
    description: 'KPI type',
    example: 'OUTPUT',
  })
  type: string;

  @ApiProperty({
    description: 'Achievement percentage',
    example: 78.5,
  })
  achievement: number;

  @ApiProperty({
    description: 'Target value',
    example: 100,
  })
  target: number;

  @ApiProperty({
    description: 'Current value',
    example: 78.5,
  })
  current: number;

  @ApiProperty({
    description: 'Color indicator',
    example: 'warning',
    enum: ['success', 'warning', 'danger', 'info'],
  })
  color: 'success' | 'warning' | 'danger' | 'info';
}

export class CalendarEventDto {
  @ApiProperty({
    description: 'Event ID',
    example: 'event_123',
  })
  id: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Input KPI Realization - Jan 2026',
  })
  title: string;

  @ApiProperty({
    description: 'Event date',
    example: '2026-01-05',
  })
  date: string;

  @ApiProperty({
    description: 'Event type',
    example: 'INPUT_DEADLINE',
    enum: [
      'PLANNING_START',
      'PLANNING_END',
      'INPUT_DEADLINE',
      'APPROVAL_DEADLINE',
      'P_KPI_SYNC',
      'OVERDUE',
    ],
  })
  type: 'PLANNING_START' | 'PLANNING_END' | 'INPUT_DEADLINE' | 'APPROVAL_DEADLINE' | 'P_KPI_SYNC' | 'OVERDUE';

  @ApiProperty({
    description: 'Event priority',
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @ApiProperty({
    description: 'Event description',
    example: 'Deadline for monthly KPI realization input',
  })
  description: string;

  @ApiProperty({
    description: 'Action URL (if applicable)',
    example: '/my-performance/realization/input',
  })
  actionUrl?: string;

  @ApiProperty({
    description: 'Is overdue',
    example: false,
  })
  isOverdue: boolean;

  @ApiProperty({
    description: 'Days until deadline',
    example: 3,
  })
  daysUntil: number;
}

export class DashboardResponseDto {
  @ApiProperty({
    description: 'Current period type',
    enum: PeriodType,
    example: PeriodType.MONTHLY,
  })
  periodType: PeriodType;

  @ApiProperty({
    description: 'Current period identifier',
    example: '2026-01',
  })
  currentPeriod: string;

  @ApiProperty({
    description: 'Score breakdown by KPI type',
    type: ScoreBreakdownDto,
  })
  scores: ScoreBreakdownDto;

  @ApiProperty({
    description: 'KPI status summary',
    type: StatusSummaryDto,
  })
  statusSummary: StatusSummaryDto;

  @ApiProperty({
    description: 'Progress indicators for each KPI type',
    type: [ProgressIndicatorDto],
  })
  progressIndicators: ProgressIndicatorDto[];

  @ApiProperty({
    description: 'User KPIs list (limited for dashboard)',
    type: [KpiResponseDto],
  })
  kpis: KpiResponseDto[];

  @ApiProperty({
    description: 'Upcoming calendar events (next 30 days)',
    type: [CalendarEventDto],
  })
  upcomingEvents: CalendarEventDto[];

  @ApiProperty({
    description: 'Pending actions count',
    example: 5,
  })
  pendingActionsCount: number;

  @ApiProperty({
    description: 'Alerts count',
    example: 2,
  })
  alertsCount: number;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2025-01-20T14:45:00Z',
  })
  lastUpdated: Date;

  // Optional fields for additional context
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
    description: 'Position name',
    example: 'Terminal Manager',
  })
  positionName: string;

  @ApiProperty({
    description: 'Department name',
    example: 'Operations',
  })
  departmentName: string;

  @ApiProperty({
    description: 'Has multi-position assignment',
    example: false,
  })
  hasMultiPosition: boolean;

  @ApiProperty({
    description: 'Available position switches (if multi-position)',
    example: ['Terminal Manager', 'Acting Operations Manager'],
  })
  availablePositions?: string[];
}
