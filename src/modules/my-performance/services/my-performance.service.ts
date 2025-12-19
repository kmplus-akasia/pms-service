import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

// Infrastructure services
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { FileService } from '../../../infrastructure/file-storage/file.service';

// Entities
import {
  KpiEntity,
  KpiOwnershipEntity,
  KpiRealizationEntity,
  KpiScoreEntity,
  ItemApprovalStatus,
  KpiType,
  Source,
} from '../../../infrastructure/database/entities';

// DTOs
import { CreateKpiDto } from '../dto/create-kpi.dto';
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

interface KpiWithOwnership {
  kpi: KpiEntity;
  ownership: KpiOwnershipEntity;
  isOwner: boolean;
  canEdit: boolean;
  canInputRealization: boolean;
}

@Injectable()
export class MyPerformanceService {
  private logger = new Logger(MyPerformanceService.name);

  constructor(
    @InjectRepository(KpiEntity)
    private readonly kpiRepository: Repository<KpiEntity>,

    @InjectRepository(KpiOwnershipEntity)
    private readonly ownershipRepository: Repository<KpiOwnershipEntity>,

    @InjectRepository(KpiRealizationEntity)
    private readonly realizationRepository: Repository<KpiRealizationEntity>,

    @InjectRepository(KpiScoreEntity)
    private readonly scoreRepository: Repository<KpiScoreEntity>,

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
    const statusSummary = await this.getStatusSummary(userKpis);

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
      const kpi = new KpiEntity();
      kpi.type = dto.type;
      kpi.natureOfWork = dto.natureOfWork;
      kpi.cascadingMethod = dto.cascadingMethod;
      kpi.target = dto.targetValue;
      kpi.targetUnit = dto.targetUnit;
      kpi.perspective = dto.bscPerspective;
      kpi.polarity = dto.polarity === 'MAXIMIZE' ? 'POSITIVE' : 'NEGATIVE';
      kpi.monitoringPeriod = dto.monitoringFrequency || 'MONTHLY';
      kpi.kpiOwnershipType = 'SPECIFIC';
      kpi.source = Source.SYSTEM;
      kpi.itemApprovalStatus = ItemApprovalStatus.DRAFT;
      kpi.createdByEmployeeNumber = user.employeeNumber;
      kpi.createdByText = user.employeeName;
      kpi.isActive = true;
      kpi.title = dto.title;
      kpi.description = dto.description;
      kpi.functionMapping = dto.fromDictionary ? 'DICTIONARY' : null;
      kpi.cohortMapping = 1; // TODO: Get from position
      kpi.version = 1;

      const savedKpi = await queryRunner.manager.save(KpiEntity, kpi);

      // Create ownership
      const ownership = new KpiOwnershipEntity();
      ownership.kpiId = savedKpi.kpiId;
      ownership.employeeNumber = user.employeeNumber;
      ownership.ownershipType = 'OWNER';
      ownership.weight = dto.weight;
      ownership.weightApprovalStatus = ItemApprovalStatus.DRAFT;
      ownership.year = new Date().getFullYear();
      ownership.version = 1;

      await queryRunner.manager.save(KpiOwnershipEntity, ownership);

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
    const kpiWithOwnership = await this.getKpiWithOwnershipCheck(kpiId, user.employeeNumber);

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
      updatedAt: new Date(),
    });

    // TODO: Send notification to approver
    // TODO: Log approval history

    await this.clearUserCache(user.employeeNumber);
  }

  /**
   * Submit KPI realization
   */
  async submitRealization(dto: SubmitRealizationDto, user: UserContext): Promise<void> {
    const kpiWithOwnership = await this.getKpiWithOwnershipCheck(dto.kpiId, user.employeeNumber);

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
      const realization = new KpiRealizationEntity();
      realization.kpiId = dto.kpiId;
      realization.employeeNumber = user.employeeNumber;
      realization.realization = dto.actualValue;
      realization.notes = dto.notes;
      realization.source = Source.SYSTEM;
      realization.submissionStatus = 'SUBMITTED';
      realization.approvalStatus = 'WAITING_FOR_APPROVAL';
      realization.generatedDate = new Date();
      realization.day = dto.week ? null : new Date().getDate();
      realization.week = dto.week || null;
      realization.month = dto.month || new Date().getMonth() + 1;
      realization.year = dto.year;
      realization.isConcluded = false;
      realization.version = 1;

      // Attach first evidence file to realization
      if (dto.evidence.length > 0) {
        realization.fileId = dto.evidence[0].fileId;
      }

      const savedRealization = await queryRunner.manager.save(KpiRealizationEntity, realization);

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
    const ownerships = await this.ownershipRepository.find({
      where: { employeeNumber },
      relations: ['kpi'],
    });

    return ownerships.map(ownership => {
      const isOwner = ownership.ownershipType === 'OWNER';
      const canEdit = ownership.ownershipType === 'OWNER' &&
                     ownership.kpi.itemApprovalStatus === ItemApprovalStatus.DRAFT;
      const canInputRealization = isOwner;

      return {
        kpi: ownership.kpi,
        ownership,
        isOwner,
        canEdit,
        canInputRealization,
      };
    });
  }

  /**
   * Get KPI with ownership validation
   */
  private async getKpiWithOwnershipCheck(kpiId: number, employeeNumber: string): Promise<KpiWithOwnership> {
    const ownership = await this.ownershipRepository.findOne({
      where: { kpiId, employeeNumber },
      relations: ['kpi'],
    });

    if (!ownership) {
      throw new NotFoundException('KPI not found or access denied');
    }

    const isOwner = ownership.ownershipType === 'OWNER';
    const canEdit = ownership.ownershipType === 'OWNER' &&
                   ownership.kpi.itemApprovalStatus === ItemApprovalStatus.DRAFT;
    const canInputRealization = isOwner;

    return {
      kpi: ownership.kpi,
      ownership,
      isOwner,
      canEdit,
      canInputRealization,
    };
  }

  /**
   * Calculate user performance scores
   */
  private async calculateUserScores(employeeNumber: string, period: string): Promise<any> {
    // TODO: Implement score calculation logic
    // This would involve aggregating KPI scores by type and calculating weighted averages

    return {
      impactScore: 85.5,
      outputScore: 78.2,
      kaiScore: 92.1,
      finalScore: 83.6,
    };
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
    // TODO: Implement progress calculation logic
    return [
      {
        type: 'IMPACT',
        achievement: 85.5,
        target: 100,
        current: 85.5,
        color: 'success',
      },
      {
        type: 'OUTPUT',
        achievement: 78.2,
        target: 100,
        current: 78.2,
        color: 'warning',
      },
      {
        type: 'KAI',
        achievement: 92.1,
        target: 100,
        current: 92.1,
        color: 'success',
      },
    ];
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
    // TODO: Implement score recalculation logic
    // This would calculate achievement percentage and weighted score
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
      targetType: 'FIXED', // TODO: Map from entity
      polarity: kpi.polarity === 'POSITIVE' ? 'MAXIMIZE' : 'MINIMIZE',
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
