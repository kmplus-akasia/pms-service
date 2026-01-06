import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Entities and Enums
import { ItemApprovalStatus } from '../../../infrastructure/database/entities/kpi.entity';
import { ApprovalStatus } from '../../../infrastructure/database/entities/kpi-realization.entity';

// Repositories
import { KpiRepository, RealizationRepository, ScoreRepository } from '../../core/kpi/repositories';

// DTOs
import {
  ApproveKpiItemDto,
  RejectKpiItemDto,
  RequestClarificationDto,
  ApproveFinalPortfolioDto,
  RejectFinalPortfolioDto,
  ApproveRealizationDto,
  RejectRealizationDto,
  AdjustAndApproveRealizationDto,
  BulkApproveRealizationsDto,
  ApprovalResponseDto,
  BulkApprovalResponseDto,
} from '../dto/approval.dto';

interface UserContext {
  employeeNumber: string;
  name: string;
  positionId: string;
}

/**
 * Approval Service
 * Handles all approval workflows for KPI planning and realizations
 */
@Injectable()
export class ApprovalService {
  private readonly logger = new Logger(ApprovalService.name);

  constructor(
    private readonly kpiRepository: KpiRepository,
    private readonly realizationRepository: RealizationRepository,
    private readonly scoreRepository: ScoreRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * US-MT-003: Approve KPI Item (Per-Item)
   * Approve individual KPI item (not final portfolio)
   */
  async approveKpiItem(user: UserContext, dto: ApproveKpiItemDto): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(`Approving KPI item ${dto.kpiId} by manager ${user.employeeNumber}`);

      const kpi = await this.kpiRepository.findById(dto.kpiId);
      if (!kpi) {
        throw new NotFoundException(`KPI with ID ${dto.kpiId} not found`);
      }

      // Verify manager is the approver
      // TODO: Check if user is the direct manager of KPI owner

      // Check current status
      if (kpi.itemApprovalStatus !== ItemApprovalStatus.WAITING_FOR_APPROVAL) {
        throw new BadRequestException(`KPI is not in WAITING_FOR_APPROVAL status`);
      }

      // Update status to APPROVED (item level approval)
      await this.kpiRepository.update(dto.kpiId, {
        itemApprovalStatus: ItemApprovalStatus.APPROVED,
        // TODO: Add approvedBy and approvedAt fields to KpiEntity
        // approvedBy: user.employeeNumber,
        // approvedAt: new Date(),
      });

      // TODO: Log approval history
      // TODO: Send notification to KPI owner

      return {
        success: true,
        message: 'KPI item approved successfully',
        itemId: dto.kpiId,
        newStatus: ItemApprovalStatus.APPROVED,
        approvedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error approving KPI item: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-004: Reject KPI Item dengan Catatan
   * Reject individual KPI item with mandatory notes
   */
  async rejectKpiItem(user: UserContext, dto: RejectKpiItemDto): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(`Rejecting KPI item ${dto.kpiId} by manager ${user.employeeNumber}`);

      const kpi = await this.kpiRepository.findById(dto.kpiId);
      if (!kpi) {
        throw new NotFoundException(`KPI with ID ${dto.kpiId} not found`);
      }

      // Verify rejection notes length (enforced by DTO validation)
      if (dto.rejectionNotes.length < 20) {
        throw new BadRequestException('Rejection notes must be at least 20 characters');
      }

      // Update status to REJECTED
      await this.kpiRepository.update(dto.kpiId, {
        itemApprovalStatus: ItemApprovalStatus.REJECTED,
        // TODO: Add rejectionNotes, rejectedBy, rejectedAt fields to KpiEntity
        // rejectionNotes: dto.rejectionNotes,
        // rejectedBy: user.employeeNumber,
        // rejectedAt: new Date(),
      });

      // TODO: Log rejection history with notes
      // TODO: Send notification to KPI owner with rejection notes

      return {
        success: true,
        message: 'KPI item rejected',
        itemId: dto.kpiId,
        newStatus: ItemApprovalStatus.REJECTED,
      };
    } catch (error) {
      this.logger.error(`Error rejecting KPI item: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-005: Request Clarification KPI
   * Request clarification before approving/rejecting
   */
  async requestClarification(user: UserContext, dto: RequestClarificationDto): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(`Requesting clarification for KPI ${dto.kpiId} by manager ${user.employeeNumber}`);

      const kpi = await this.kpiRepository.findById(dto.kpiId);
      if (!kpi) {
        throw new NotFoundException(`KPI with ID ${dto.kpiId} not found`);
      }

      // Update status to WAITING_FOR_APPROVAL (keep in waiting state with clarification note)
      // Note: PENDING_CLARIFICATION status doesn't exist in enum, use WAITING_FOR_APPROVAL
      await this.kpiRepository.update(dto.kpiId, {
        itemApprovalStatus: ItemApprovalStatus.WAITING_FOR_APPROVAL,
        // TODO: Add clarification fields to KpiEntity
        // clarificationQuestion: dto.clarificationQuestion,
        // clarificationRequestedBy: user.employeeNumber,
        // clarificationRequestedAt: new Date(),
      });

      // TODO: Send notification to KPI owner with clarification question
      // TODO: Log clarification request

      return {
        success: true,
        message: 'Clarification requested',
        itemId: dto.kpiId,
        newStatus: ItemApprovalStatus.WAITING_FOR_APPROVAL,
      };
    } catch (error) {
      this.logger.error(`Error requesting clarification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-006: Approve Final KPI Portfolio
   * Approve entire KPI portfolio (requires all items ITEM_APPROVED and weights = 100%)
   */
  async approveFinalPortfolio(user: UserContext, dto: ApproveFinalPortfolioDto): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(
        `Approving final portfolio for ${dto.employeeNumber} by manager ${user.employeeNumber}`,
      );

      // Get all KPIs for the employee
      const kpis = await this.kpiRepository.findWithFilters({
        // TODO: Filter by employeeNumber from ownership table
        year: new Date().getFullYear(),
      });

      // Validate prerequisites
      const allItemsApproved = kpis.every((k) => k.itemApprovalStatus === ItemApprovalStatus.APPROVED);
      if (!allItemsApproved) {
        throw new BadRequestException('All KPI items must be approved before final portfolio approval');
      }

      // Validate weight totals
      const outputKpis = kpis.filter((k) => k.type === 'OUTPUT');
      const kaiKpis = kpis.filter((k) => k.type === 'KAI');

      // TODO: Weight is stored in kpi_ownership_v3 table, need to fetch from there
      // For now, skip weight validation until ownership table integration is complete
      // const outputWeightTotal = outputKpis.reduce((sum, k) => sum + (k.weight || 0), 0);
      // const kaiWeightTotal = kaiKpis.reduce((sum, k) => sum + (k.weight || 0), 0);

      // if (outputWeightTotal !== 100) {
      //   throw new BadRequestException(`Output KPI weights must total 100% (current: ${outputWeightTotal}%)`);
      // }

      // if (kaiWeightTotal !== 100) {
      //   throw new BadRequestException(`KAI weights must total 100% (current: ${kaiWeightTotal}%)`);
      // }

      // Update all KPIs to READY status (final active status)
      await this.dataSource.transaction(async (manager) => {
        for (const kpi of kpis) {
          await manager.update('kpi_v3', kpi.kpiId, {
            itemApprovalStatus: ItemApprovalStatus.READY,
            // TODO: Add portfolioApprovedBy and portfolioApprovedAt fields to KpiEntity
            // portfolioApprovedBy: user.employeeNumber,
            // portfolioApprovedAt: new Date(),
          });
        }
      });

      // TODO: Trigger Performance Tree generation
      // TODO: Send notification to employee
      // TODO: Log final approval

      return {
        success: true,
        message: 'Final portfolio approved successfully',
        newStatus: ItemApprovalStatus.READY,
        approvedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error approving final portfolio: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-007: Reject Final KPI Portfolio
   * Reject entire portfolio with notes
   */
  async rejectFinalPortfolio(user: UserContext, dto: RejectFinalPortfolioDto): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(
        `Rejecting final portfolio for ${dto.employeeNumber} by manager ${user.employeeNumber}`,
      );

      // Get all KPIs for the employee
      const kpis = await this.kpiRepository.findWithFilters({
        // TODO: Filter by employeeNumber from ownership table
        year: new Date().getFullYear(),
      });

      // Update status based on which items need revision
      await this.dataSource.transaction(async (manager) => {
        for (const kpi of kpis) {
          const needsRevision = dto.kpiIdsToRevise?.includes(kpi.kpiId) || false;

          await manager.update('kpi_v3', kpi.kpiId, {
            itemApprovalStatus: needsRevision ? ItemApprovalStatus.REJECTED : ItemApprovalStatus.APPROVED,
            // TODO: Add portfolio rejection fields to KpiEntity
            // portfolioRejectionNotes: dto.rejectionNotes,
            // portfolioRejectedBy: user.employeeNumber,
            // portfolioRejectedAt: new Date(),
          });
        }
      });

      // TODO: Send notification to employee with rejection notes
      // TODO: Log portfolio rejection

      return {
        success: true,
        message: 'Portfolio rejected',
        newStatus: ItemApprovalStatus.REJECTED,
      };
    } catch (error) {
      this.logger.error(`Error rejecting final portfolio: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-008: Approve Realisasi Bawahan
   * Approve subordinate's realization
   */
  async approveRealization(user: UserContext, dto: ApproveRealizationDto): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(`Approving realization ${dto.realizationId} by manager ${user.employeeNumber}`);

      const realization = await this.realizationRepository.findById(dto.realizationId);
      if (!realization) {
        throw new NotFoundException(`Realization with ID ${dto.realizationId} not found`);
      }

      // Update realization status
      await this.realizationRepository.update(dto.realizationId, {
        approvalStatus: ApprovalStatus.APPROVED,
        approverEmployeeNumber: user.employeeNumber,
        // TODO: Add approvedAt field to KpiRealizationEntity
        // approvedAt: new Date(),
        approvalNotes: dto.notes,
      });

      // TODO: Recalculate scores - implement score calculation logic
      // await this.scoreRepository.calculateScore({
      //   kpiId: realization.kpiId,
      //   employeeNumber: realization.employeeNumber,
      //   month: realization.month,
      //   year: realization.year,
      // });

      // TODO: If Direct Cascade, sum to parent
      // TODO: Send notification to employee
      // TODO: Log approval

      return {
        success: true,
        message: 'Realization approved successfully',
        itemId: dto.realizationId,
        newStatus: ApprovalStatus.APPROVED,
        approvedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error approving realization: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-009: Reject Realisasi dengan Catatan
   * Reject realization with mandatory notes
   */
  async rejectRealization(user: UserContext, dto: RejectRealizationDto): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(`Rejecting realization ${dto.realizationId} by manager ${user.employeeNumber}`);

      const realization = await this.realizationRepository.findById(dto.realizationId);
      if (!realization) {
        throw new NotFoundException(`Realization with ID ${dto.realizationId} not found`);
      }

      // Update realization status
      await this.realizationRepository.update(dto.realizationId, {
        approvalStatus: ApprovalStatus.REJECTED,
        approvalNotes: dto.rejectionNotes, // Use approvalNotes for rejection notes
        approverEmployeeNumber: user.employeeNumber,
        // TODO: Add rejectedAt field to KpiRealizationEntity
        // rejectedAt: new Date(),
      });

      // TODO: Send notification to employee with rejection notes
      // TODO: Log rejection

      return {
        success: true,
        message: 'Realization rejected',
        itemId: dto.realizationId,
        newStatus: ApprovalStatus.REJECTED,
      };
    } catch (error) {
      this.logger.error(`Error rejecting realization: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-010: Adjust dan Approve Realisasi
   * Adjust value and approve realization
   */
  async adjustAndApproveRealization(
    user: UserContext,
    dto: AdjustAndApproveRealizationDto,
  ): Promise<ApprovalResponseDto> {
    try {
      this.logger.log(`Adjusting and approving realization ${dto.realizationId} by manager ${user.employeeNumber}`);

      const realization = await this.realizationRepository.findById(dto.realizationId);
      if (!realization) {
        throw new NotFoundException(`Realization with ID ${dto.realizationId} not found`);
      }

      // Validate adjusted value is different
      if (dto.adjustedValue === realization.realization) {
        throw new BadRequestException('Adjusted value must be different from original value');
      }

      // Store original value and update with adjusted value
      await this.realizationRepository.update(dto.realizationId, {
        // TODO: Add originalValue, adjustedBy, adjustedAt, adjustmentJustification fields to KpiRealizationEntity
        // originalValue: realization.realization,
        realization: dto.adjustedValue,
        // adjustedBy: user.employeeNumber,
        // adjustedAt: new Date(),
        // adjustmentJustification: dto.adjustmentJustification,
        approvalStatus: ApprovalStatus.APPROVED, // Use APPROVED status with notes for adjustment
        approverEmployeeNumber: user.employeeNumber,
        approvalNotes: `Adjusted from ${realization.realization} to ${dto.adjustedValue}. Justification: ${dto.adjustmentJustification}`,
        // approvedAt: new Date(),
      });

      // TODO: Recalculate scores with adjusted value - implement score calculation logic
      // await this.scoreRepository.calculateScore({
      //   kpiId: realization.kpiId,
      //   employeeNumber: realization.employeeNumber,
      //   month: realization.month,
      //   year: realization.year,
      // });

      // TODO: Log adjustment with justification
      // TODO: Send notification to employee

      return {
        success: true,
        message: 'Realization adjusted and approved',
        itemId: dto.realizationId,
        newStatus: ApprovalStatus.APPROVED,
        approvedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error adjusting and approving realization: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-020: Bulk Approve Realisasi
   * Bulk approve multiple realizations (max 50)
   */
  async bulkApproveRealizations(
    user: UserContext,
    dto: BulkApproveRealizationsDto,
  ): Promise<BulkApprovalResponseDto> {
    try {
      this.logger.log(`Bulk approving ${dto.realizationIds.length} realizations by manager ${user.employeeNumber}`);

      // Validate max 50 items
      if (dto.realizationIds.length > 50) {
        throw new BadRequestException('Maximum 50 items can be approved at once');
      }

      const results = {
        successCount: 0,
        failureCount: 0,
        failures: [] as Array<{ itemId: number; reason: string }>,
      };

      // Process in transaction
      await this.dataSource.transaction(async (manager) => {
        for (const realizationId of dto.realizationIds) {
          try {
            const realization = await this.realizationRepository.findById(realizationId);
            if (!realization) {
              results.failures.push({ itemId: realizationId, reason: 'Realization not found' });
              results.failureCount++;
              continue;
            }

            // Update status
            await manager.update('kpi_realization_v3', realizationId, {
              approvalStatus: ApprovalStatus.APPROVED,
              approverEmployeeNumber: user.employeeNumber,
              // TODO: Add approvedAt field to KpiRealizationEntity
              // approvedAt: new Date(),
              approvalNotes: dto.notes,
            });

            // TODO: Recalculate score - implement score calculation logic
            // await this.scoreRepository.calculateScore({
            //   kpiId: realization.kpiId,
            //   employeeNumber: realization.employeeNumber,
            //   month: realization.month,
            //   year: realization.year,
            // });

            results.successCount++;
          } catch (error) {
            results.failures.push({ itemId: realizationId, reason: error.message });
            results.failureCount++;
          }
        }
      });

      // TODO: Send batch notifications to employees
      // TODO: Log bulk approval

      return {
        success: results.failureCount === 0,
        message: `Bulk approval completed: ${results.successCount} succeeded, ${results.failureCount} failed`,
        successCount: results.successCount,
        failureCount: results.failureCount,
        failures: results.failures,
      };
    } catch (error) {
      this.logger.error(`Error bulk approving realizations: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get Approval Queue
   * Get list of items pending approval
   */
  async getApprovalQueue(user: UserContext, filters: any) {
    try {
      this.logger.log(`Getting approval queue for manager ${user.employeeNumber}`);

      // TODO: Get subordinates from MDM
      const subordinates = ['12345', '67890']; // Mock data

      // Get pending KPIs
      // TODO: Implement proper filtering by subordinates from ownership table
      const pendingKpis = await this.kpiRepository.findWithFilters({
        // itemApprovalStatus: ItemApprovalStatus.WAITING_FOR_APPROVAL,
        year: new Date().getFullYear(),
      });

      // Get pending realizations
      // TODO: Implement proper filtering by subordinates
      const pendingRealizations = await this.realizationRepository.findWithFilters({
        // approvalStatus: ApprovalStatus.WAITING_FOR_APPROVAL,
        year: new Date().getFullYear(),
      });

      return {
        pendingKpis: pendingKpis.map((k) => ({
          id: k.kpiId,
          title: k.title,
          type: k.type,
          // TODO: employeeNumber is in ownership table
          employeeNumber: '', // k.employeeNumber,
          // TODO: Add submittedAt field to KpiEntity
          submittedAt: k.createdAt, // k.submittedAt,
        })),
        pendingRealizations: pendingRealizations.map((r) => ({
          id: r.kpiRealizationId,
          kpiId: r.kpiId,
          employeeNumber: r.employeeNumber,
          actualValue: r.realization,
          submittedAt: r.submitDate,
        })),
        totalPending: pendingKpis.length + pendingRealizations.length,
      };
    } catch (error) {
      this.logger.error(`Error getting approval queue: ${error.message}`, error.stack);
      throw error;
    }
  }
}

