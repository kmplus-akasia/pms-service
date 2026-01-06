import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Repositories
import {
  KpiRepository,
  EmployeePerformanceScoreRepository,
  EmployeePerformanceScoreFinalRepository,
} from '../../core/kpi/repositories';

// DTOs
import {
  TeamDashboardResponseDto,
  TeamSummaryDto,
  TeamMemberSummaryDto,
} from '../dto/team-dashboard.response.dto';
import { MemberPerformanceDetailDto } from '../dto/member-detail.response.dto';
import {
  TeamCalendarQueryDto,
  TeamCalendarResponseDto,
  TeamCalendarEventDto,
  CalendarEventType,
} from '../dto/team-calendar.dto';
import { ExportReportQueryDto, ExportReportResponseDto } from '../dto/team-calendar.dto';

// Infrastructure
import { RedisService } from '../../../infrastructure/cache/redis.service';

interface UserContext {
  employeeNumber: string;
  name: string;
  positionId: string;
}

/**
 * My Team Performance Service
 * Handles team monitoring, dashboard, and reporting
 */
@Injectable()
export class MyTeamPerformanceService {
  private readonly logger = new Logger(MyTeamPerformanceService.name);

  constructor(
    private readonly kpiRepository: KpiRepository,
    private readonly employeePerformanceScoreRepository: EmployeePerformanceScoreRepository,
    private readonly employeePerformanceScoreFinalRepository: EmployeePerformanceScoreFinalRepository,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  /**
   * US-MT-001: View Team Dashboard
   * Get team dashboard with summary and member list
   */
  async getTeamDashboard(user: UserContext, period?: string): Promise<TeamDashboardResponseDto> {
    try {
      this.logger.log(`Getting team dashboard for manager: ${user.employeeNumber}`);

      // Get current period
      const currentPeriod = period || this.getCurrentPeriod();

      // TODO: Get subordinates from MDM based on manager's position
      const subordinates = await this.getDirectSubordinates(user.employeeNumber);

      if (subordinates.length === 0) {
        return {
          summary: this.getEmptyTeamSummary(),
          members: [],
          currentPeriod,
        };
      }

      // Get performance scores for all subordinates
      const memberSummaries = await Promise.all(
        subordinates.map((sub) => this.getMemberSummary(sub, currentPeriod)),
      );

      // Calculate team summary
      const summary = this.calculateTeamSummary(memberSummaries);

      return {
        summary,
        members: memberSummaries,
        currentPeriod,
      };
    } catch (error) {
      this.logger.error(`Error getting team dashboard: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-002: View Member Performance Detail
   * Get detailed performance of a specific team member
   */
  async getMemberDetail(
    user: UserContext,
    memberEmployeeNumber: string,
    period?: string,
  ): Promise<MemberPerformanceDetailDto> {
    try {
      this.logger.log(`Getting member detail for ${memberEmployeeNumber} by manager ${user.employeeNumber}`);

      // Verify that the member is a direct subordinate
      const isSubordinate = await this.verifyDirectSubordinate(user.employeeNumber, memberEmployeeNumber);
      if (!isSubordinate) {
        throw new ForbiddenException('You can only view direct subordinates');
      }

      const currentPeriod = period || this.getCurrentPeriod();
      const [year, month] = currentPeriod.split('-').map(Number);

      // Get member's KPIs
      const kpis = await this.kpiRepository.findWithFilters({
        employeeNumber: memberEmployeeNumber,
        year,
      });

      // Get member's performance score
      const performanceScore = await this.employeePerformanceScoreRepository.getLatestScore(
        memberEmployeeNumber,
      );

      // TODO: Get member info from MDM
      const memberInfo = {
        employeeName: 'Member Name', // TODO: Get from MDM
        nipp: memberEmployeeNumber,
        positionName: 'Position Name', // TODO: Get from MDM
        levelBod: 'BOD-5', // TODO: Get from MDM
        cohortName: 'Cohort A', // TODO: Get from cohort mapping
      };

      // Count pending approvals and at-risk KPIs
      const pendingApprovalCount = kpis.filter((k) => k.itemApprovalStatus === 'WAITING_FOR_APPROVAL').length;
      const atRiskCount = 0; // TODO: Calculate from realization achievement

      return {
        employeeNumber: memberEmployeeNumber,
        ...memberInfo,
        currentScore: performanceScore?.kpiScore || 0,
        impactScore: performanceScore?.impactScore || 0,
        outputScore: performanceScore?.outputScore || 0,
        kaiScore: performanceScore?.boundaryScore || 0, // KAI is stored as boundaryScore
        kpis: kpis.map((kpi) => this.mapKpiToResponseDto(kpi)),
        pendingApprovalCount,
        atRiskCount,
        hasMultiPosition: false, // TODO: Check multi-position logic
        currentPeriod,
      };
    } catch (error) {
      this.logger.error(`Error getting member detail: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-018: View Team KPI Status Overview
   * Get KPI status overview for entire team
   */
  async getTeamStatusOverview(user: UserContext, period?: string) {
    try {
      this.logger.log(`Getting team status overview for manager: ${user.employeeNumber}`);

      const currentPeriod = period || this.getCurrentPeriod();
      const [year, month] = currentPeriod.split('-').map(Number);

      // Get subordinates
      const subordinates = await this.getDirectSubordinates(user.employeeNumber);

      // Get all KPIs for all subordinates
      const allKpis = await Promise.all(
        subordinates.map((sub) =>
          this.kpiRepository.findWithFilters({
            employeeNumber: sub.employeeNumber,
            year,
          }),
        ),
      );

      const flatKpis = allKpis.flat();

      // Count by status (TODO: Calculate monitoring status from realization achievement)
      const onTrackCount = 0; // flatKpis.filter((k) => achievement >= 100).length;
      const behindCount = 0; // flatKpis.filter((k) => achievement 80-99).length;
      const atRiskCount = 0; // flatKpis.filter((k) => achievement < 80).length;
      const pendingCount = flatKpis.filter((k) => k.itemApprovalStatus === 'WAITING_FOR_APPROVAL').length;

      // Create heatmap data (member x KPI matrix)
      const heatmap = subordinates.map((sub) => {
        const memberKpis = flatKpis.filter((k) => {
          // TODO: Filter by employeeNumber from kpi_ownership_v3 table
          return true; // Placeholder
        });
        return {
          employeeNumber: sub.employeeNumber,
          employeeName: sub.employeeName,
          kpis: memberKpis.map((k) => ({
            kpiId: k.kpiId,
            title: k.title,
            status: 'PENDING', // TODO: Calculate from realization
            achievement: 0, // TODO: Calculate from realization
          })),
        };
      });

      return {
        period: currentPeriod,
        statusCounts: {
          onTrack: onTrackCount,
          behind: behindCount,
          atRisk: atRiskCount,
          pending: pendingCount,
        },
        heatmap,
      };
    } catch (error) {
      this.logger.error(`Error getting team status overview: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-028: View Team Calendar & Deadline Tracking
   * Get team calendar with deadlines
   */
  async getTeamCalendar(user: UserContext, query: TeamCalendarQueryDto): Promise<TeamCalendarResponseDto> {
    try {
      this.logger.log(`Getting team calendar for manager: ${user.employeeNumber}`);

      const period = query.period || this.getCurrentPeriod();
      const viewMode = query.viewMode || 'MONTHLY';

      // Get subordinates
      const subordinates = await this.getDirectSubordinates(user.employeeNumber);

      // Generate calendar events
      const events: TeamCalendarEventDto[] = [];

      // Planning deadlines (January-February)
      events.push({
        eventId: 'planning-deadline',
        eventType: CalendarEventType.PLANNING_DEADLINE,
        eventDate: `${period.split('-')[0]}-02-28`,
        title: 'KPI Planning Deadline',
        description: 'Final deadline for KPI planning submission',
        colorCode: 'blue',
        pendingItemsCount: 0, // TODO: Count pending planning items
        affectedMembers: subordinates.map((s) => s.employeeNumber),
        actionAvailable: true,
        actionType: 'REVIEW_SUBMISSIONS',
      });

      // Monthly input realization deadline (5th of each month)
      events.push({
        eventId: 'monthly-input',
        eventType: CalendarEventType.INPUT_REALIZATION,
        eventDate: `${period}-05`,
        title: 'Monthly Realization Input Deadline',
        description: 'Subordinates must submit monthly realizations',
        colorCode: 'green',
        pendingItemsCount: 0, // TODO: Count pending realizations
        affectedMembers: subordinates.map((s) => s.employeeNumber),
        actionAvailable: false,
      });

      // Monthly approval deadline (10th of each month)
      events.push({
        eventId: 'monthly-approval',
        eventType: CalendarEventType.APPROVAL_DEADLINE,
        eventDate: `${period}-10`,
        title: 'Monthly Approval Deadline',
        description: 'Review and approve monthly realizations',
        colorCode: 'yellow',
        pendingItemsCount: 0, // TODO: Count pending approvals
        affectedMembers: subordinates.map((s) => s.employeeNumber),
        actionAvailable: true,
        actionType: 'GO_TO_APPROVAL_QUEUE',
      });

      // TODO: Add more event types based on actual KPI schedules

      return {
        events,
        period,
        viewMode,
        totalEvents: events.length,
        actionRequiredCount: events.filter((e) => e.actionAvailable).length,
        overdueCount: 0, // TODO: Calculate overdue events
      };
    } catch (error) {
      this.logger.error(`Error getting team calendar: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-021: Export Team Performance Report
   * Export team performance report
   */
  async exportTeamReport(user: UserContext, query: ExportReportQueryDto): Promise<ExportReportResponseDto> {
    try {
      this.logger.log(`Exporting team report for manager: ${user.employeeNumber}`);

      // TODO: Implement actual export logic
      // This is a stub implementation

      const fileName = `team-performance-${new Date().toISOString().split('T')[0]}.${query.format.toLowerCase()}`;
      const downloadUrl = `https://storage.example.com/reports/${fileName}`;

      return {
        success: true,
        downloadUrl,
        fileName,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        fileSizeKb: 2048,
      };
    } catch (error) {
      this.logger.error(`Error exporting team report: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Get direct subordinates from MDM
   */
  private async getDirectSubordinates(managerEmployeeNumber: string): Promise<any[]> {
    // TODO: Implement MDM integration to get direct subordinates
    // For now, return mock data
    return [
      {
        employeeNumber: '12345',
        employeeName: 'Ahmad Dani',
        positionName: 'Officer Kinerja',
        levelBod: 'BOD-5',
      },
      {
        employeeNumber: '67890',
        employeeName: 'Budi Santoso',
        positionName: 'Officer HRD',
        levelBod: 'BOD-5',
      },
    ];
  }

  /**
   * Verify that a member is a direct subordinate
   */
  private async verifyDirectSubordinate(
    managerEmployeeNumber: string,
    memberEmployeeNumber: string,
  ): Promise<boolean> {
    // TODO: Implement MDM check
    const subordinates = await this.getDirectSubordinates(managerEmployeeNumber);
    return subordinates.some((s) => s.employeeNumber === memberEmployeeNumber);
  }

  /**
   * Get member summary for dashboard
   */
  private async getMemberSummary(subordinate: any, period: string): Promise<TeamMemberSummaryDto> {
    const [year, month] = period.split('-').map(Number);

    // Get performance score
    const performanceScore = await this.employeePerformanceScoreRepository.findWithFilters({
      employeeNumber: subordinate.employeeNumber,
      year,
      month,
    });

    const score = performanceScore.length > 0 ? performanceScore[0] : null;
    const currentScore = score?.kpiScore || 0;

    // Get pending approvals
    const kpis = await this.kpiRepository.findWithFilters({
      employeeNumber: subordinate.employeeNumber,
      year,
    });

    const pendingApprovalCount = kpis.filter((k) => k.itemApprovalStatus === 'WAITING_FOR_APPROVAL').length;
    const atRiskCount = 0; // TODO: Calculate from realization achievement

    return {
      employeeNumber: subordinate.employeeNumber,
      employeeName: subordinate.employeeName,
      positionName: subordinate.positionName,
      levelBod: subordinate.levelBod,
      cohortName: 'Cohort A', // TODO: Get from cohort mapping
      currentScore,
      scoreColor: this.getScoreColor(currentScore),
      pendingApprovalCount,
      atRiskCount,
      hasMultiPosition: false, // TODO: Check multi-position
      lastActivity: new Date(),
    };
  }

  /**
   * Calculate team summary from member summaries
   */
  private calculateTeamSummary(members: TeamMemberSummaryDto[]): TeamSummaryDto {
    if (members.length === 0) {
      return this.getEmptyTeamSummary();
    }

    const totalScore = members.reduce((sum, m) => sum + m.currentScore, 0);
    const averageScore = totalScore / members.length;

    const totalPendingApproval = members.reduce((sum, m) => sum + m.pendingApprovalCount, 0);
    const totalAtRisk = members.reduce((sum, m) => sum + m.atRiskCount, 0);

    const membersAtRisk = members.filter((m) => m.currentScore < 80).length;
    const membersOnTrack = members.filter((m) => m.currentScore >= 100).length;
    const membersBehind = members.filter((m) => m.currentScore >= 80 && m.currentScore < 100).length;

    return {
      totalMembers: members.length,
      averageScore,
      pendingApprovalCount: totalPendingApproval,
      atRiskCount: totalAtRisk,
      membersAtRisk,
      membersOnTrack,
      membersBehind,
    };
  }

  /**
   * Get empty team summary
   */
  private getEmptyTeamSummary(): TeamSummaryDto {
    return {
      totalMembers: 0,
      averageScore: 0,
      pendingApprovalCount: 0,
      atRiskCount: 0,
      membersAtRisk: 0,
      membersOnTrack: 0,
      membersBehind: 0,
    };
  }

  /**
   * Get score color based on value
   */
  private getScoreColor(score: number): string {
    if (score >= 100) return 'success';
    if (score >= 80) return 'warning';
    return 'danger';
  }

  /**
   * Get current period (YYYY-MM format)
   */
  private getCurrentPeriod(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Map KPI entity to response DTO
   */
  private mapKpiToResponseDto(kpi: any): any {
    // TODO: Implement proper mapping with ownership data
    return {
      id: kpi.kpiId,
      title: kpi.title,
      type: kpi.type,
      status: kpi.itemApprovalStatus,
      monitoringStatus: 'PENDING', // TODO: Calculate from realization
      targetValue: kpi.target,
      targetUnit: kpi.targetUnit,
      weight: 0, // TODO: Get from ownership table
    };
  }
}

