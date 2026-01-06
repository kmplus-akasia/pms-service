import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Repositories
import { KpiRepository } from '../../core/kpi/repositories';

// DTOs
import {
  CascadeKpiDto,
  DraftKpiForSubordinateDto,
  DraftKaiForSubordinateDto,
  CascadedKpiReviewStatusDto,
  RespondToCascadeRevisionDto,
  CascadeMethod,
} from '../dto/cascade.dto';

// Import entity enums
import { KpiType, Polarity, ItemApprovalStatus, TargetType, MonitoringPeriod } from '../../../infrastructure/database/entities/kpi.entity';

interface UserContext {
  employeeNumber: string;
  name: string;
  positionId: string;
}

/**
 * Cascade Service
 * Handles KPI cascading from manager to subordinates
 */
@Injectable()
export class CascadeService {
  private readonly logger = new Logger(CascadeService.name);

  constructor(
    private readonly kpiRepository: KpiRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * US-MT-011: Draft KPI untuk Bawahan
   * Draft a KPI for subordinate (manager initiates)
   */
  async draftKpiForSubordinate(user: UserContext, dto: DraftKpiForSubordinateDto) {
    try {
      this.logger.log(`Drafting KPI for subordinate ${dto.employeeNumber} by manager ${user.employeeNumber}`);

      // TODO: Verify that dto.employeeNumber is a direct subordinate

      // Create KPI draft for subordinate
      const kpi = await this.kpiRepository.create({
        // Note: employeeNumber is stored in kpi_ownership_v3, not in kpi_v3
        title: dto.title,
        description: dto.description,
        type: dto.type as KpiType,
        target: dto.targetValue,
        targetUnit: dto.targetUnit,
        // targetType: dto.targetType as TargetType, // TODO: Add to entity if needed
        polarity: dto.polarity as Polarity,
        perspective: dto.bscPerspective,
        monitoringPeriod: dto.monitoringFrequency as MonitoringPeriod,
        // weight: dto.weight, // Stored in kpi_ownership_v3
        itemApprovalStatus: ItemApprovalStatus.DRAFT,
        createdByEmployeeNumber: user.employeeNumber,
        // draftedByManager: true, // TODO: Add field if needed
        // year: new Date().getFullYear(), // TODO: Add field if needed
        version: 1,
        isActive: true,
      } as any);

      // TODO: Create ownership record in kpi_ownership_v3 with dto.employeeNumber and weight
      // TODO: Send notification to subordinate
      // TODO: Log draft creation

      return {
        success: true,
        message: 'KPI drafted for subordinate',
        kpiId: kpi.kpiId,
      };
    } catch (error) {
      this.logger.error(`Error drafting KPI for subordinate: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-012 & US-MT-013: Cascade KPI to Subordinates
   * Cascade KPI to subordinates (Direct or Indirect)
   */
  async cascadeKpi(user: UserContext, dto: CascadeKpiDto) {
    try {
      this.logger.log(
        `Cascading KPI ${dto.parentKpiId} to ${dto.recipients.length} subordinates by ${user.employeeNumber}`,
      );

      // Get parent KPI
      const parentKpi = await this.kpiRepository.findById(dto.parentKpiId);
      if (!parentKpi) {
        throw new NotFoundException(`Parent KPI with ID ${dto.parentKpiId} not found`);
      }

      // TODO: Verify user is the owner of parent KPI (check kpi_ownership_v3)
      // if (parentKpi ownership !== user.employeeNumber) {
      //   throw new BadRequestException('You can only cascade your own KPIs');
      // }

      // Verify parent KPI is approved
      if (parentKpi.itemApprovalStatus !== ItemApprovalStatus.APPROVED && 
          parentKpi.itemApprovalStatus !== ItemApprovalStatus.READY) {
        throw new BadRequestException('Parent KPI must be approved before cascading');
      }

      // Validate Direct Cascade requirements
      if (dto.cascadeMethod === CascadeMethod.DIRECT) {
        // For Direct Cascade, all children must have same unit as parent
        // This will be enforced when children submit
      }

      // Create child KPIs for each recipient
      const childKpis = await Promise.all(
        dto.recipients.map(async (recipient) => {
          // TODO: Verify recipient is a direct subordinate

          const childKpi = await this.kpiRepository.create({
            // Note: employeeNumber stored in kpi_ownership_v3
            title: parentKpi.title,
            description: parentKpi.description,
            type: parentKpi.type,
            target: recipient.targetValue,
            targetUnit: parentKpi.targetUnit, // Inherit unit from parent
            // targetType: parentKpi.targetType, // TODO: Add if needed
            polarity: parentKpi.polarity,
            perspective: parentKpi.perspective,
            monitoringPeriod: parentKpi.monitoringPeriod,
            // weight: recipient.weight, // Stored in kpi_ownership_v3
            itemApprovalStatus: ItemApprovalStatus.DRAFT, // TODO: Add CASCADED_PENDING_REVIEW status if needed
            parentKpiId: dto.parentKpiId,
            cascadingMethod: dto.cascadeMethod as any,
            // cascadedBy: user.employeeNumber, // TODO: Add field if needed
            // cascadedAt: new Date(), // TODO: Add field if needed
            createdByEmployeeNumber: user.employeeNumber,
            // year: new Date().getFullYear(), // TODO: Add field if needed
            version: 1,
            isActive: true,
          } as any);

          // TODO: Create ownership record in kpi_ownership_v3 with recipient.employeeNumber and weight
          // TODO: Send notification to recipient for review
          return childKpi;
        }),
      );

      // TODO: Log cascade action

      return {
        success: true,
        message: `KPI cascaded to ${dto.recipients.length} subordinates`,
        childKpiIds: childKpis.map((k) => k.kpiId),
        cascadeMethod: dto.cascadeMethod,
      };
    } catch (error) {
      this.logger.error(`Error cascading KPI: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-024: Draft KAI untuk Bawahan
   * Draft KAI for subordinate linked to their KPI Output
   */
  async draftKaiForSubordinate(user: UserContext, dto: DraftKaiForSubordinateDto) {
    try {
      this.logger.log(`Drafting KAI for subordinate ${dto.employeeNumber} by manager ${user.employeeNumber}`);

      // Verify linked KPI Output exists and belongs to subordinate
      const linkedKpi = await this.kpiRepository.findById(dto.linkedKpiOutputId);
      if (!linkedKpi) {
        throw new NotFoundException(`Linked KPI Output with ID ${dto.linkedKpiOutputId} not found`);
      }

      // TODO: Verify linkedKpi belongs to subordinate (check kpi_ownership_v3)
      // if (linkedKpi ownership !== dto.employeeNumber) {
      //   throw new BadRequestException('Linked KPI Output must belong to the subordinate');
      // }

      if (linkedKpi.type !== KpiType.OUTPUT) {
        throw new BadRequestException('Can only link KAI to KPI Output');
      }

      // Create KAI draft for subordinate
      const kai = await this.kpiRepository.create({
        // Note: employeeNumber stored in kpi_ownership_v3
        title: dto.title,
        description: dto.description,
        type: KpiType.KAI,
        target: dto.targetValue,
        targetUnit: dto.targetUnit,
        // weight: dto.weight, // Stored in kpi_ownership_v3
        natureOfWork: dto.natureOfWork as any,
        monitoringPeriod: dto.monitoringFrequency as MonitoringPeriod,
        // linkedKpiOutputId: dto.linkedKpiOutputId, // TODO: Add field if needed
        itemApprovalStatus: ItemApprovalStatus.DRAFT,
        createdByEmployeeNumber: user.employeeNumber,
        // draftedByManager: true, // TODO: Add field if needed
        // year: new Date().getFullYear(), // TODO: Add field if needed
        version: 1,
        isActive: true,
      } as any);

      // TODO: Create ownership record in kpi_ownership_v3 with dto.employeeNumber and weight
      // TODO: Store link to KPI Output in a relationship table if needed
      // TODO: Send notification to subordinate
      // TODO: Log KAI draft creation

      return {
        success: true,
        message: 'KAI drafted for subordinate',
        kaiId: kai.kpiId,
        linkedKpiOutputId: dto.linkedKpiOutputId,
      };
    } catch (error) {
      this.logger.error(`Error drafting KAI for subordinate: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-025: Monitor Cascaded KPI Review Status
   * Get status of cascaded KPIs
   */
  async getCascadedKpiReviewStatus(user: UserContext): Promise<CascadedKpiReviewStatusDto[]> {
    try {
      this.logger.log(`Getting cascaded KPI review status for manager ${user.employeeNumber}`);

      // TODO: Get all KPIs cascaded by this manager
      // Need to add cascadedBy field to entity or track in separate table
      // For now, get KPIs created by this manager (placeholder)
      const cascadedKpis = await this.kpiRepository.findWithFilters({
        // createdByEmployeeNumber: user.employeeNumber, // Not in KpiFilters
        year: new Date().getFullYear(),
      });

      // Map to review status DTOs
      const reviewStatuses: CascadedKpiReviewStatusDto[] = cascadedKpis.map((kpi) => {
        // Calculate days left until auto-accept (7 days from cascaded date)
        let daysLeft: number | undefined;
        // TODO: Calculate from cascadedAt field (needs to be added to entity)
        // if (kpi.status === 'CASCADED_PENDING_REVIEW' && kpi.cascadedAt) {
        //   const autoAcceptDate = new Date(kpi.cascadedAt);
        //   autoAcceptDate.setDate(autoAcceptDate.getDate() + 7);
        //   const now = new Date();
        //   daysLeft = Math.ceil((autoAcceptDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        // }

        return {
          kpiId: kpi.kpiId,
          kpiTitle: kpi.title,
          recipientEmployeeNumber: 'TBD', // TODO: Get from kpi_ownership_v3
          recipientName: 'Employee Name', // TODO: Get from MDM
          cascadedDate: kpi.createdAt, // Using createdAt as placeholder
          reviewStatus: kpi.itemApprovalStatus,
          daysLeft,
          revisionNotes: undefined, // TODO: Add field if needed
        };
      });

      return reviewStatuses;
    } catch (error) {
      this.logger.error(`Error getting cascaded KPI review status: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Respond to Cascade Revision Request
   * Handle subordinate's revision request for cascaded KPI
   */
  async respondToCascadeRevision(user: UserContext, dto: RespondToCascadeRevisionDto) {
    try {
      this.logger.log(`Responding to cascade revision for KPI ${dto.kpiId} by manager ${user.employeeNumber}`);

      const kpi = await this.kpiRepository.findById(dto.kpiId);
      if (!kpi) {
        throw new NotFoundException(`KPI with ID ${dto.kpiId} not found`);
      }

      // TODO: Verify manager is the one who cascaded (check cascadedBy field or createdBy)
      // if (kpi.cascadedBy !== user.employeeNumber) {
      //   throw new BadRequestException('You can only respond to your own cascaded KPIs');
      // }

      // TODO: Verify status (need to add CASCADED_REVISION_REQUESTED status)
      // if (kpi.itemApprovalStatus !== 'CASCADED_REVISION_REQUESTED') {
      //   throw new BadRequestException('KPI is not in revision requested status');
      // }

      switch (dto.action) {
        case 'ADJUST':
          // Adjust and re-cascade
          if (!dto.newTargetValue) {
            throw new BadRequestException('New target value is required for ADJUST action');
          }

          await this.kpiRepository.update(dto.kpiId, {
            target: dto.newTargetValue,
            itemApprovalStatus: ItemApprovalStatus.DRAFT,
            // revisionResponse: dto.responseNotes, // TODO: Add field if needed
            // revisionRespondedBy: user.employeeNumber, // TODO: Add field if needed
            // revisionRespondedAt: new Date(), // TODO: Add field if needed
          } as any);

          // TODO: Send notification to subordinate
          return {
            success: true,
            message: 'KPI adjusted and re-cascaded',
            action: 'ADJUST',
          };

        case 'EXPLAIN':
          // Send explanation without changing KPI
          // TODO: Store explanation in a notes/comments table
          // await this.kpiRepository.update(dto.kpiId, {
          //   revisionResponse: dto.responseNotes,
          //   revisionRespondedBy: user.employeeNumber,
          //   revisionRespondedAt: new Date(),
          // });

          // TODO: Send notification to subordinate with explanation
          return {
            success: true,
            message: 'Explanation sent to subordinate',
            action: 'EXPLAIN',
          };

        case 'WITHDRAW':
          // Withdraw the cascade (soft delete)
          await this.kpiRepository.update(dto.kpiId, {
            isActive: false,
            // withdrawnBy: user.employeeNumber, // TODO: Add field if needed
            // withdrawnAt: new Date(), // TODO: Add field if needed
            // withdrawalReason: dto.responseNotes, // TODO: Add field if needed
          } as any);

          // TODO: Send notification to subordinate
          return {
            success: true,
            message: 'Cascade withdrawn',
            action: 'WITHDRAW',
          };

        default:
          throw new BadRequestException(`Invalid action: ${dto.action}`);
      }
    } catch (error) {
      this.logger.error(`Error responding to cascade revision: ${error.message}`, error.stack);
      throw error;
    }
  }
}

