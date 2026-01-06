import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Infrastructure services
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { FileService } from '../../../infrastructure/file-storage/file.service';

// Repositories
import {
  KpiRepository,
  type KpiWithOwnership,
  RealizationRepository,
  ScoreRepository,
  EmployeePerformanceScoreRepository,
  EmployeePerformanceScoreFinalRepository,
  CohortKpiFormulaRepository,
} from '../../core/kpi/repositories';

// Entities
import {
  KpiEntity,
  KpiOwnershipEntity,
  KpiRealizationEntity,
  ItemApprovalStatus,
  KpiType,
  Source,
  Polarity,
} from '../../../infrastructure/database/entities';

// DTOs
import { CreateKpiDto, TargetType } from '../dto/create-kpi.dto';
import { SubmitRealizationDto } from '../dto/submit-realization.dto';
import { KpiResponseDto, KpiStatus, MonitoringStatus } from '../dto/kpi-response.dto';
import { DashboardResponseDto, PeriodType } from '../dto/dashboard.response.dto';

// Internal types
interface UserContext {
  employeeNumber: string;
  employeeName: string;
  positionId: string;
  departmentId: string;
  permissions: string[];
}

@Injectable()
export class MyPerformanceService {
  private logger = new Logger(MyPerformanceService.name);

  constructor(
    private readonly kpiRepository: KpiRepository,
    private readonly realizationRepository: RealizationRepository,
    private readonly scoreRepository: ScoreRepository,
    private readonly employeePerformanceScoreRepository: EmployeePerformanceScoreRepository,
    private readonly employeePerformanceScoreFinalRepository: EmployeePerformanceScoreFinalRepository,
    private readonly cohortKpiFormulaRepository: CohortKpiFormulaRepository,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Get user performance dashboard
   */
  async getDashboard(user: UserContext): Promise<DashboardResponseDto> {
    const cacheKey = `dashboard:${user.employeeNumber}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Get current period
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const periodType = PeriodType.MONTHLY;

    // Get user's KPIs with ownership
    const userKpis = await this.getUserKpisWithOwnership(user.employeeNumber);

    // Calculate scores
    const scores = await this.calculateUserScores(user.employeeNumber, currentPeriod);

    // Get status summary
    const statusSummary = await this.kpiRepository.getDashboardStats(user.employeeNumber);

    // Get progress indicators
    const progressIndicators = await this.getProgressIndicators(user.employeeNumber, currentPeriod);

    // Get upcoming calendar events
    const upcomingEvents = await this.getUpcomingCalendarEvents(user.employeeNumber);

    // Count pending actions and alerts
    const pendingActionsCount = await this.getPendingActionsCount(user.employeeNumber);
    const alertsCount = await this.getAlertsCount(user.employeeNumber);

    const dashboard: DashboardResponseDto = {
      periodType,
      currentPeriod,
      scores,
      statusSummary,
      progressIndicators,
      kpis: userKpis.map(kwo => this.mapKpiToResponse(kwo)),
      upcomingEvents,
      pendingActionsCount,
      alertsCount,
      lastUpdated: new Date(),
      employeeNumber: user.employeeNumber,
      employeeName: user.employeeName,
      positionName: 'Position Name', // TODO: Get from MDM
      departmentName: 'Department Name', // TODO: Get from MDM
      hasMultiPosition: false, // TODO: Check multi-position logic
    };

    // Cache for 5 minutes
    await this.redisService.set(cacheKey, JSON.stringify(dashboard), 300);

    return dashboard;
  }

  /**
   * Create new KPI draft
   */
  async createKpiDraft(dto: CreateKpiDto, user: UserContext): Promise<KpiResponseDto> {
    // Validate business rules
    await this.validateKpiCreation(dto, user);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create KPI entity
      const kpiData: Partial<KpiEntity> = {
        type: dto.type as any, // Type assertion for enum compatibility
        natureOfWork: dto.natureOfWork as any,
        cascadingMethod: dto.cascadingMethod as any,
        target: dto.targetValue,
        targetUnit: dto.targetUnit,
        perspective: dto.bscPerspective,
        polarity: dto.polarity === 'MAXIMIZE' ? Polarity.POSITIVE : Polarity.NEGATIVE,
        monitoringPeriod: dto.monitoringFrequency as any || 'MONTHLY',
        kpiOwnershipType: 'SPECIFIC' as any,
        source: Source.SYSTEM,
        itemApprovalStatus: ItemApprovalStatus.DRAFT,
        createdByEmployeeNumber: user.employeeNumber,
        createdByText: user.employeeName,
        isActive: true,
        title: dto.title,
        description: dto.description,
        functionMapping: dto.fromDictionary ? 'DICTIONARY' : undefined,
        cohortMapping: 1, // TODO: Get from position
        version: 1,
      };

      const savedKpi = await this.kpiRepository.create(kpiData);

      // Create ownership
      const ownershipData: Partial<KpiOwnershipEntity> = {
        kpiId: savedKpi.kpiId,
        employeeNumber: user.employeeNumber,
        ownershipType: 'OWNER' as any, // Type assertion for enum compatibility
        weight: dto.weight,
        weightApprovalStatus: ItemApprovalStatus.DRAFT as any,
        year: new Date().getFullYear(),
        version: 1,
      };

      const ownership = await this.kpiRepository.createOwnership(ownershipData);

      await queryRunner.commitTransaction();

      // Clear dashboard cache
      await this.clearUserCache(user.employeeNumber);

      const kpiWithOwnership: KpiWithOwnership = {
        kpi: savedKpi,
        ownership,
        isOwner: true,
        canEdit: true,
        canInputRealization: true,
      };

      return this.mapKpiToResponse(kpiWithOwnership);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to create KPI draft', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Submit KPI for approval
   */
  async submitKpiForApproval(kpiId: number, user: UserContext): Promise<void> {
    const kpiWithOwnership = await this.kpiRepository.findKpiWithOwnershipCheck(kpiId, user.employeeNumber);

    if (!kpiWithOwnership) {
      throw new NotFoundException('KPI not found or access denied');
    }

    if (!kpiWithOwnership.canEdit) {
      throw new ForbiddenException('You do not have permission to submit this KPI');
    }

    if (kpiWithOwnership.kpi.itemApprovalStatus !== ItemApprovalStatus.DRAFT) {
      throw new BadRequestException('KPI is not in draft status');
    }

    // Validate weight totals
    await this.validateKpiWeightsForSubmission(user.employeeNumber);

    // Update status
    await this.kpiRepository.update(kpiId, {
      itemApprovalStatus: ItemApprovalStatus.WAITING_FOR_APPROVAL,
    });

    // TODO: Send notification to approver
    // TODO: Log approval history

    await this.clearUserCache(user.employeeNumber);
  }

  /**
   * Submit KPI realization
   */
  async submitRealization(dto: SubmitRealizationDto, user: UserContext): Promise<void> {
    const kpiWithOwnership = await this.kpiRepository.findKpiWithOwnershipCheck(dto.kpiId, user.employeeNumber);

    if (!kpiWithOwnership) {
      throw new NotFoundException('KPI not found or access denied');
    }

    if (!kpiWithOwnership.canInputRealization) {
      throw new ForbiddenException('You do not have permission to input realization for this KPI');
    }

    // Validate evidence files
    for (const evidence of dto.evidence) {
      const exists = await this.fileService.fileExists(evidence.fileId);
      if (!exists) {
        throw new BadRequestException(`Evidence file ${evidence.fileId} not found`);
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create realization record
      const realizationData: Partial<KpiRealizationEntity> = {
        kpiId: dto.kpiId,
        employeeNumber: user.employeeNumber,
        realization: dto.actualValue,
        notes: dto.notes,
        fileId: dto.evidence.length > 0 ? dto.evidence[0].fileId : undefined,
        source: Source.SYSTEM,
        submissionStatus: 'SUBMITTED' as any, // Type assertion for enum compatibility
        approvalStatus: 'WAITING_FOR_APPROVAL' as any,
        generatedDate: new Date(),
        day: dto.week ? undefined : new Date().getDate(),
        week: dto.week || undefined,
        month: dto.month || new Date().getMonth() + 1,
        year: dto.year,
        isConcluded: false,
        version: 1,
      };

      const savedRealization = await this.realizationRepository.create(realizationData);

      // Create additional evidence records if needed
      // TODO: Implement evidence attachment logic

      await queryRunner.commitTransaction();

      // Recalculate scores
      await this.recalculateKpiScore(dto.kpiId, user.employeeNumber, dto.month || new Date().getMonth() + 1, dto.year);

      // Clear caches
      await this.clearUserCache(user.employeeNumber);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to submit realization', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get user's KPIs with ownership information
   */
  private async getUserKpisWithOwnership(employeeNumber: string): Promise<KpiWithOwnership[]> {
    return await this.kpiRepository.findUserKpisWithOwnership(employeeNumber);
  }


  /**
   * Calculate user performance scores
   */
  private async calculateUserScores(employeeNumber: string, period: string): Promise<any> {
    try {
      // Parse period (format: "2026-01")
      const [yearStr, monthStr] = period.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);

      // Get the latest performance score for this employee and period
      const performanceScores = await this.employeePerformanceScoreRepository.findWithFilters({
        employeeNumber,
        year,
        month,
      });

      if (performanceScores.length > 0) {
        const latestScore = performanceScores[0]; // Already ordered by date desc
        return {
          impactScore: latestScore.impactScore || 0,
          outputScore: latestScore.outputScore || 0,
          kaiScore: latestScore.kpiScore || 0, // Using kpiScore as KAI score for now
          finalScore: latestScore.finalScore || 0,
        };
      }

      // If no scores found, return default values
      // TODO: This could trigger score calculation if needed
      return {
        impactScore: 0,
        outputScore: 0,
        kaiScore: 0,
        finalScore: 0,
      };
    } catch (error) {
      this.logger.error(`Failed to calculate user scores for ${employeeNumber}`, error);
      // Return default values on error
      return {
        impactScore: 0,
        outputScore: 0,
        kaiScore: 0,
        finalScore: 0,
      };
    }
  }

  /**
   * Get KPI status summary
   */
  private async getStatusSummary(kpis: KpiWithOwnership[]): Promise<any> {
    const summary = {
      total: kpis.length,
      draft: 0,
      pendingApproval: 0,
      approved: 0,
      rejected: 0,
      onTrack: 0,
      atRisk: 0,
      behind: 0,
      pending: 0,
    };

    for (const kpiWithOwnership of kpis) {
      const kpi = kpiWithOwnership.kpi;

      // Count by approval status
      switch (kpi.itemApprovalStatus) {
        case ItemApprovalStatus.DRAFT:
          summary.draft++;
          break;
        case ItemApprovalStatus.WAITING_FOR_APPROVAL:
          summary.pendingApproval++;
          break;
        case ItemApprovalStatus.APPROVED:
          summary.approved++;
          break;
        case ItemApprovalStatus.REJECTED:
          summary.rejected++;
          break;
      }

      // TODO: Count by monitoring status (onTrack, atRisk, behind, pending)
      // This would require checking recent realizations and calculating achievement
    }

    return summary;
  }

  /**
   * Get progress indicators
   */
  private async getProgressIndicators(employeeNumber: string, period: string): Promise<any[]> {
    try {
      // Parse period
      const [yearStr, monthStr] = period.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);

      // Get performance scores for this period
      const performanceScores = await this.employeePerformanceScoreRepository.findWithFilters({
        employeeNumber,
        year,
        month,
      });

      const indicators: any[] = [];

      if (performanceScores.length > 0) {
        const score = performanceScores[0];

        // Impact score indicator
        indicators.push({
          type: 'IMPACT',
          achievement: score.impactScore || 0,
          target: 100, // Standard target
          current: score.impactScore || 0,
          color: this.getScoreColor(score.impactScore || 0),
        });

        // Output score indicator
        indicators.push({
          type: 'OUTPUT',
          achievement: score.outputScore || 0,
          target: 100,
          current: score.outputScore || 0,
          color: this.getScoreColor(score.outputScore || 0),
        });

        // KAI score indicator
        indicators.push({
          type: 'KAI',
          achievement: score.kpiScore || 0,
          target: 100,
          current: score.kpiScore || 0,
          color: this.getScoreColor(score.kpiScore || 0),
        });
      } else {
        // Default indicators when no scores are available
        indicators.push(
          { type: 'IMPACT', achievement: 0, target: 100, current: 0, color: 'info' },
          { type: 'OUTPUT', achievement: 0, target: 100, current: 0, color: 'info' },
          { type: 'KAI', achievement: 0, target: 100, current: 0, color: 'info' }
        );
      }

      return indicators;
    } catch (error) {
      this.logger.error(`Failed to get progress indicators for ${employeeNumber}`, error);
      // Return default indicators on error
      return [
        { type: 'IMPACT', achievement: 0, target: 100, current: 0, color: 'info' },
        { type: 'OUTPUT', achievement: 0, target: 100, current: 0, color: 'info' },
        { type: 'KAI', achievement: 0, target: 100, current: 0, color: 'info' }
      ];
    }
  }

  /**
   * Get color indicator based on score
   */
  private getScoreColor(score: number): string {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'danger';
  }

  /**
   * Get upcoming calendar events
   */
  private async getUpcomingCalendarEvents(employeeNumber: string): Promise<any[]> {
    // TODO: Implement calendar event logic
    return [
      {
        id: 'event_1',
        title: 'Input KPI Realization - Jan 2026',
        date: '2026-01-05',
        type: 'INPUT_DEADLINE',
        priority: 'HIGH',
        description: 'Deadline for monthly KPI realization input',
        actionUrl: '/my-performance/realization/input',
        isOverdue: false,
        daysUntil: 3,
      },
    ];
  }

  /**
   * Get pending actions count
   */
  private async getPendingActionsCount(employeeNumber: string): Promise<number> {
    // TODO: Count pending approvals, overdue inputs, etc.
    return 5;
  }

  /**
   * Get alerts count
   */
  private async getAlertsCount(employeeNumber: string): Promise<number> {
    // TODO: Count KPIs at risk, behind, overdue
    return 2;
  }

  /**
   * Validate KPI creation rules
   */
  private async validateKpiCreation(dto: CreateKpiDto, user: UserContext): Promise<void> {
    // Validate weight doesn't exceed limits
    // TODO: Check total weight for user doesn't exceed 100% per KPI type

    // Validate required fields based on type
    if (dto.type === KpiType.OUTPUT && !dto.bscPerspective) {
      throw new BadRequestException('BSC Perspective is required for OUTPUT KPIs');
    }

    if (dto.type === KpiType.KAI) {
      if (!dto.natureOfWork) {
        throw new BadRequestException('Nature of Work is required for KAI');
      }
      if (!dto.monitoringFrequency) {
        throw new BadRequestException('Monitoring Frequency is required for KAI');
      }
    }

    // Validate progressive targets if applicable
    if (dto.targetType === 'PROGRESSIVE' && (!dto.progressiveTargets || Object.keys(dto.progressiveTargets).length === 0)) {
      throw new BadRequestException('Progressive targets are required when target type is PROGRESSIVE');
    }
  }

  /**
   * Validate KPI weights for submission
   */
  private async validateKpiWeightsForSubmission(employeeNumber: string): Promise<void> {
    // TODO: Validate that total weights for each KPI type equal 100%
  }

  /**
   * Recalculate KPI score after realization submission
   */
  private async recalculateKpiScore(kpiId: number, employeeNumber: string, month: number, year: number): Promise<void> {
    try {
      // First, ensure individual KPI score is calculated/updated
      await this.calculateIndividualKpiScore(kpiId, employeeNumber, month, year);

      // Then trigger aggregate performance score recalculation
      await this.recalculateEmployeePerformanceScore(employeeNumber, year, month);

      this.logger.log(`Score recalculation completed for KPI ${kpiId}, employee ${employeeNumber}`);
    } catch (error) {
      this.logger.error(`Failed to recalculate scores for KPI ${kpiId}`, error);
      // Don't throw error to avoid breaking the realization submission flow
    }
  }

  /**
   * Calculate individual KPI score
   */
  private async calculateIndividualKpiScore(kpiId: number, employeeNumber: string, month: number, year: number): Promise<void> {
    // This would use the existing ScoreRepository.calculateAndSaveScore method
    // TODO: Get KPI realization data and calculate score
    // For now, this is a placeholder
  }

  /**
   * Recalculate aggregate employee performance score
   */
  private async recalculateEmployeePerformanceScore(employeeNumber: string, year: number, month: number): Promise<void> {
    try {
      // Get all KPI scores for this employee in the period
      const kpiScores = await this.scoreRepository.findWithFilters({
        employeeNumber,
        year,
        month,
      });

      if (kpiScores.length === 0) {
        this.logger.warn(`No KPI scores found for ${employeeNumber} in ${year}-${month}`);
        return;
      }

      // Group scores by KPI type
      const impactScores = kpiScores.filter(score => score.kpi?.type === 'IMPACT');
      const outputScores = kpiScores.filter(score => score.kpi?.type === 'OUTPUT');
      const kaiScores = kpiScores.filter(score => score.kpi?.type === 'KAI');

      // Calculate weighted averages for each type
      const impactScore = this.calculateWeightedAverage(impactScores);
      const outputScore = this.calculateWeightedAverage(outputScores);
      const kpiScore = this.calculateWeightedAverage(kaiScores);

      // Get the cohort formula for this employee
      // TODO: Get employee's cohort ID from position mapping
      const cohortId = await this.getEmployeeCohortId(employeeNumber);
      const formula = await this.cohortKpiFormulaRepository.getLatestFormulaForCohort(cohortId);

      let finalScore: number;
      let weights: { kpiWeight: number; outputWeight: number; impactWeight: number };

      if (formula) {
        // Use formula weights
        weights = {
          kpiWeight: formula.kpiScoreWeight || 0,
          outputWeight: formula.outputScoreWeight || 0,
          impactWeight: formula.impactScoreWeight || 0,
        };

        // Calculate weighted final score
        finalScore = (
          (kpiScore * weights.kpiWeight) +
          (outputScore * weights.outputWeight) +
          (impactScore * weights.impactWeight)
        ) / 100; // Weights are in percentages
      } else {
        // Fallback to equal weights
        weights = { kpiWeight: 33.33, outputWeight: 33.33, impactWeight: 33.34 };
        finalScore = (impactScore + outputScore + kpiScore) / 3;
      }

      // Save or update the aggregate performance score
      await this.employeePerformanceScoreRepository.calculateAndSaveScore(
        employeeNumber,
        year,
        month,
        formula?.cohortKpiFormulaId || 1, // Use formula ID or default
        {
          finalScore,
          kpiScore,
          outputScore,
          impactScore,
          boundaryScore: 0, // TODO: Calculate boundary score based on business rules
          kpiScoreWeight: weights.kpiWeight,
          outputScoreWeight: weights.outputWeight,
          impactScoreWeight: weights.impactWeight,
          kpiKpiIds: kaiScores.map(s => s.kpiId.toString()).join(','),
          outputKpiIds: outputScores.map(s => s.kpiId.toString()).join(','),
          impactKpiIds: impactScores.map(s => s.kpiId.toString()).join(','),
        }
      );

      this.logger.log(`Aggregate performance score calculated for ${employeeNumber}: ${finalScore}`);
    } catch (error) {
      this.logger.error(`Failed to recalculate employee performance score for ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Get employee's cohort ID
   * TODO: Implement proper cohort mapping based on position
   */
  private async getEmployeeCohortId(employeeNumber: string): Promise<number> {
    // Placeholder - should get from employee position mapping
    // For now, return a default cohort ID
    return 1;
  }

  /**
   * Calculate weighted average of scores
   */
  private calculateWeightedAverage(scores: any[]): number {
    if (scores.length === 0) return 0;

    const totalWeight = scores.reduce((sum, score) => sum + (score.weight || 0), 0);
    if (totalWeight === 0) return 0;

    const weightedSum = scores.reduce((sum, score) =>
      sum + ((score.score || 0) * (score.weight || 0)), 0
    );

    return weightedSum / totalWeight;
  }

  /**
   * Map KPI entity to response DTO
   */
  private mapKpiToResponse(kpiWithOwnership: KpiWithOwnership): KpiResponseDto {
    const { kpi, ownership, isOwner, canEdit, canInputRealization } = kpiWithOwnership;

    // Map approval status to response status
    let status: KpiStatus;
    switch (kpi.itemApprovalStatus) {
      case ItemApprovalStatus.DRAFT:
        status = KpiStatus.DRAFT;
        break;
      case ItemApprovalStatus.WAITING_FOR_APPROVAL:
        status = KpiStatus.PENDING_APPROVAL;
        break;
      case ItemApprovalStatus.APPROVED:
        status = KpiStatus.APPROVED;
        break;
      case ItemApprovalStatus.REJECTED:
        status = KpiStatus.REJECTED;
        break;
      default:
        status = KpiStatus.DRAFT;
    }

    return {
      kpiId: kpi.kpiId,
      title: kpi.title,
      description: kpi.description,
      type: kpi.type,
      targetValue: kpi.target,
      targetUnit: kpi.targetUnit,
      targetType: TargetType.FIXED, // TODO: Map from entity
      polarity: kpi.polarity === Polarity.POSITIVE ? Polarity.POSITIVE : Polarity.NEGATIVE,
      cascadingMethod: kpi.cascadingMethod,
      weight: ownership.weight,
      status,
      monitoringStatus: MonitoringStatus.ON_TRACK, // TODO: Calculate
      currentAchievement: 85.5, // TODO: Calculate
      weightedScore: 25.65, // TODO: Calculate
      ytdAchievement: 87.2, // TODO: Calculate
      owner: {
        employeeNumber: ownership.employeeNumber,
        employeeName: 'Employee Name', // TODO: Get from MDM
        ownershipType: ownership.ownershipType,
        weight: ownership.weight,
      },
      progress: [], // TODO: Get progress data
      createdAt: kpi.createdAt,
      updatedAt: kpi.updatedAt,
      bscPerspective: kpi.perspective,
      natureOfWork: kpi.natureOfWork,
      monitoringFrequency: kpi.monitoringPeriod,
      fromDictionary: kpi.functionMapping === 'DICTIONARY',
    };
  }

  /**
   * Clear user-related caches
   */
  private async clearUserCache(employeeNumber: string): Promise<void> {
    const keys = [
      `dashboard:${employeeNumber}`,
      `kpi:list:${employeeNumber}`,
      `kpi:detail:*`, // TODO: More specific invalidation
    ];

    for (const key of keys) {
      try {
        if (key.includes('*')) {
          // TODO: Implement pattern deletion if needed
        } else {
          await this.redisService.del(key);
        }
      } catch (error) {
        this.logger.warn(`Failed to clear cache key: ${key}`, error);
      }
    }
  }
}
