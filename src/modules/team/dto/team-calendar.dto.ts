import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

/**
 * Event Type Enum
 */
export enum CalendarEventType {
  PLANNING_DEADLINE = 'PLANNING_DEADLINE',
  INPUT_REALIZATION = 'INPUT_REALIZATION',
  APPROVAL_DEADLINE = 'APPROVAL_DEADLINE',
  AUTO_APPROVE_TRIGGER = 'AUTO_APPROVE_TRIGGER',
  OVERDUE = 'OVERDUE',
  PKPI_SYNC = 'PKPI_SYNC',
}

/**
 * Calendar Event DTO
 * US-MT-028: View Team Calendar & Deadline Tracking
 */
export class TeamCalendarEventDto {
  @ApiProperty({ example: 'event-123' })
  eventId: string;

  @ApiProperty({ enum: CalendarEventType, example: CalendarEventType.APPROVAL_DEADLINE })
  eventType: CalendarEventType;

  @ApiProperty({ example: '2026-01-10' })
  eventDate: string;

  @ApiProperty({ example: 'Monthly Approval Deadline' })
  title: string;

  @ApiProperty({ example: 'Approve monthly realizations from team', required: false })
  description?: string;

  @ApiProperty({ example: 'yellow', enum: ['blue', 'green', 'yellow', 'red'] })
  colorCode: string;

  @ApiProperty({ example: 5, description: 'Number of pending items for this event' })
  pendingItemsCount: number;

  @ApiProperty({ example: ['12345', '67890'], description: 'Employee numbers of affected members' })
  affectedMembers: string[];

  @ApiProperty({ example: true, description: 'Can user take action on this event?' })
  actionAvailable: boolean;

  @ApiProperty({ example: 'REVIEW_SUBMISSIONS', required: false })
  actionType?: string;
}

/**
 * Team Calendar Query DTO
 */
export class TeamCalendarQueryDto {
  @ApiProperty({ example: '2026-01', required: false })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty({ example: 'MONTHLY', enum: ['MONTHLY', 'WEEKLY', 'AGENDA'], required: false })
  @IsOptional()
  @IsEnum(['MONTHLY', 'WEEKLY', 'AGENDA'])
  viewMode?: string;

  @ApiProperty({ example: '12345', required: false, description: 'Filter by specific member' })
  @IsOptional()
  @IsString()
  memberEmployeeNumber?: string;

  @ApiProperty({ enum: CalendarEventType, required: false })
  @IsOptional()
  @IsEnum(CalendarEventType)
  eventType?: CalendarEventType;
}

/**
 * Team Calendar Response
 */
export class TeamCalendarResponseDto {
  @ApiProperty({ type: [TeamCalendarEventDto] })
  events: TeamCalendarEventDto[];

  @ApiProperty({ example: '2026-01' })
  period: string;

  @ApiProperty({ example: 'MONTHLY' })
  viewMode: string;

  @ApiProperty({ example: 12, description: 'Total events in period' })
  totalEvents: number;

  @ApiProperty({ example: 5, description: 'Events requiring action' })
  actionRequiredCount: number;

  @ApiProperty({ example: 2, description: 'Overdue events' })
  overdueCount: number;
}

/**
 * Export Report Query DTO
 * US-MT-021: Export Team Performance Report
 */
export class ExportReportQueryDto {
  @ApiProperty({ example: 'EXCEL', enum: ['EXCEL', 'PDF'] })
  @IsEnum(['EXCEL', 'PDF'])
  format: string;

  @ApiProperty({ example: 'ALL', enum: ['ALL', 'SELECTED'], required: false })
  @IsOptional()
  @IsEnum(['ALL', 'SELECTED'])
  scope?: string;

  @ApiProperty({ example: ['12345', '67890'], required: false, description: 'Selected member employee numbers' })
  @IsOptional()
  selectedMembers?: string[];

  @ApiProperty({ example: 'CURRENT_QUARTER', enum: ['CURRENT_QUARTER', 'YTD', 'CUSTOM'], required: false })
  @IsOptional()
  @IsEnum(['CURRENT_QUARTER', 'YTD', 'CUSTOM'])
  periodScope?: string;

  @ApiProperty({ example: '2026-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2026-03-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 'SUMMARY', enum: ['SUMMARY', 'DETAILED'], required: false })
  @IsOptional()
  @IsEnum(['SUMMARY', 'DETAILED'])
  contentLevel?: string;
}

/**
 * Export Report Response
 */
export class ExportReportResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'https://storage.example.com/reports/team-performance-2026-01.xlsx' })
  downloadUrl: string;

  @ApiProperty({ example: 'team-performance-2026-01.xlsx' })
  fileName: string;

  @ApiProperty({ example: '2026-01-15T10:30:00Z', description: 'Link expires at' })
  expiresAt: Date;

  @ApiProperty({ example: 2048, description: 'File size in KB' })
  fileSizeKb: number;
}

