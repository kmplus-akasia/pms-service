import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Entities and Enums
import { KpiType, Polarity, MonitoringPeriod } from '../../../infrastructure/database/entities/kpi.entity';

// Repositories
import { KpiRepository } from '../../core/kpi/repositories';

// DTOs
import {
  AllocateKpiFromTreeDto,
  UnallocatedKpiListResponseDto,
  UnallocatedKpiItemDto,
  AssignOwnerDto,
  AssignSharedOwnerDto,
  SamePositionAllocationDto,
  AllocationStrategy,
} from '../dto/allocation.dto';

interface UserContext {
  employeeNumber: string;
  name: string;
  positionId: string;
}

/**
 * Allocation Service
 * Handles KPI allocation from Performance Tree to team members
 */
@Injectable()
export class AllocationService {
  private readonly logger = new Logger(AllocationService.name);

  constructor(
    private readonly kpiRepository: KpiRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * US-MT-022: View Unallocated KPI from Performance Tree
   * Get list of unallocated KPI items from Performance Tree
   */
  async getUnallocatedKpis(user: UserContext, filters: any): Promise<UnallocatedKpiListResponseDto> {
    try {
      this.logger.log(`Getting unallocated KPIs for manager ${user.employeeNumber}`);

      // TODO: Get unallocated items from Performance Tree
      // TODO: Filter by master positions of direct subordinates
      // This is a stub implementation

      const items: UnallocatedKpiItemDto[] = [
        {
          performanceTreeItemId: 1,
          title: 'Revenue Growth Q1',
          type: 'OUTPUT',
          masterPositionName: 'Officer Kinerja Individu',
          targetValue: 100,
          targetUnit: 'Million IDR',
          bscPerspective: 'Financial',
          incumbentCount: 2,
          incumbentEmployeeNumbers: ['12345', '67890'],
          allocationStatus: 'NEEDS_ALLOCATION',
          createdDate: new Date('2026-01-10'),
        },
      ];

      const outputCount = items.filter((i) => i.type === 'OUTPUT').length;
      const kaiCount = items.filter((i) => i.type === 'KAI').length;

      return {
        items,
        totalCount: items.length,
        outputCount,
        kaiCount,
      };
    } catch (error) {
      this.logger.error(`Error getting unallocated KPIs: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-023: Allocate KPI from Performance Tree to Team Members
   * Allocate a Performance Tree item to team members
   */
  async allocateKpiFromTree(user: UserContext, dto: AllocateKpiFromTreeDto) {
    try {
      this.logger.log(
        `Allocating Performance Tree item ${dto.performanceTreeItemId} to ${dto.incumbents.length} team members`,
      );

      // TODO: Get Performance Tree item details
      // This is a stub implementation
      const treeItem = {
        id: dto.performanceTreeItemId,
        title: 'Revenue Growth Q1',
        description: 'Increase revenue by 20%',
        type: 'OUTPUT',
        targetUnit: 'Million IDR',
        bscPerspective: 'Financial',
        monitoringFrequency: 'MONTHLY',
      };

      // Validate allocation strategy
      if (dto.incumbents.length > 1 && !dto.allocationStrategy) {
        throw new BadRequestException('Allocation strategy is required for multiple incumbents');
      }

      // Validate owner assignment
      const owners = dto.incumbents.filter((i) => i.isOwner);
      if (dto.allocationStrategy === AllocationStrategy.SHARED_OWNER) {
        // Shared Owner: Must have exactly 1 Owner
        if (owners.length !== 1) {
          throw new BadRequestException('Shared Owner strategy requires exactly 1 Owner');
        }

        // Validate contribution percentages sum to 100
        const sharedOwners = dto.incumbents.filter((i) => !i.isOwner);
        const totalContribution = sharedOwners.reduce((sum, i) => sum + (i.contributionPercentage || 0), 0);
        if (totalContribution !== 100) {
          throw new BadRequestException(
            `Shared Owner contribution percentages must sum to 100% (current: ${totalContribution}%)`,
          );
        }

        // Create 1 KPI with Owner and Shared Owners
        const owner = owners[0];
        const kpi = await this.kpiRepository.create({
          // TODO: employeeNumber is stored in kpi_ownership_v3 table
          // employeeNumber: owner.employeeNumber,
          title: treeItem.title,
          description: treeItem.description,
          type: treeItem.type as KpiType,
          target: owner.targetValue,
          targetUnit: treeItem.targetUnit,
          // TODO: Add targetType field to KpiEntity (Fixed/Progressive)
          // targetType: 'FIXED',
          polarity: Polarity.POSITIVE, // TODO: Get from tree item (POSITIVE = Maximize, NEGATIVE = Minimize)
          perspective: treeItem.bscPerspective,
          monitoringPeriod: treeItem.monitoringFrequency as MonitoringPeriod,
          // TODO: weight is stored in kpi_ownership_v3 table
          // weight: owner.weight,
          // TODO: Add allocatedFromTreeItemId, allocatedBy, allocatedAt, year fields to KpiEntity
          // allocatedFromTreeItemId: dto.performanceTreeItemId,
          // allocatedBy: user.employeeNumber,
          // allocatedAt: new Date(),
          // year: new Date().getFullYear(),
        });

        // TODO: Create ownership records for Owner and Shared Owners in kpi_ownership_v3
        // TODO: Send notifications to all incumbents

        return {
          success: true,
          message: 'KPI allocated with Shared Owner strategy',
          strategy: AllocationStrategy.SHARED_OWNER,
          kpiIds: [kpi.kpiId],
        };
      } else {
        // Duplicate KPI: Each incumbent gets their own KPI instance
        if (owners.length !== dto.incumbents.length) {
          throw new BadRequestException('Duplicate KPI strategy requires all incumbents to be Owners');
        }

        const kpis = await Promise.all(
          dto.incumbents.map(async (incumbent) => {
            return await this.kpiRepository.create({
              // TODO: employeeNumber is stored in kpi_ownership_v3 table
              // employeeNumber: incumbent.employeeNumber,
              title: treeItem.title,
              description: treeItem.description,
              type: treeItem.type as KpiType,
              target: incumbent.targetValue,
              targetUnit: treeItem.targetUnit,
              // TODO: Add targetType field to KpiEntity (Fixed/Progressive)
              // targetType: 'FIXED',
              polarity: Polarity.POSITIVE, // TODO: Get from tree item (POSITIVE = Maximize, NEGATIVE = Minimize)
              perspective: treeItem.bscPerspective,
              monitoringPeriod: treeItem.monitoringFrequency as MonitoringPeriod,
              // TODO: weight is stored in kpi_ownership_v3 table
              // weight: incumbent.weight,
              // TODO: Add allocatedFromTreeItemId, allocatedBy, allocatedAt, year fields to KpiEntity
              // allocatedFromTreeItemId: dto.performanceTreeItemId,
              // allocatedBy: user.employeeNumber,
              // allocatedAt: new Date(),
              // year: new Date().getFullYear(),
            });
          }),
        );

        // TODO: Create ownership records for each incumbent in kpi_ownership_v3
        // TODO: Send notifications to all incumbents

        return {
          success: true,
          message: 'KPI allocated with Duplicate strategy',
          strategy: AllocationStrategy.DUPLICATE_KPI,
          kpiIds: kpis.map((k) => k.kpiId),
        };
      }
    } catch (error) {
      this.logger.error(`Error allocating KPI from tree: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-014: Assign Owner untuk KPI
   * Assign an owner to a KPI
   */
  async assignOwner(user: UserContext, dto: AssignOwnerDto) {
    try {
      this.logger.log(`Assigning owner ${dto.ownerEmployeeNumber} to KPI ${dto.kpiId}`);

      const kpi = await this.kpiRepository.findById(dto.kpiId);
      if (!kpi) {
        throw new NotFoundException(`KPI with ID ${dto.kpiId} not found`);
      }

      // TODO: Verify ownerEmployeeNumber is a direct subordinate

      // Update KPI owner
      // Note: employeeNumber is stored in kpi_ownership_v3 table, not in kpi_v3
      // await this.kpiRepository.update(dto.kpiId, {
      //   employeeNumber: dto.ownerEmployeeNumber,
      //   ownerAssignedBy: user.employeeNumber,
      //   ownerAssignedAt: new Date(),
      // });

      // TODO: Create or update ownership record in kpi_ownership_v3 table
      // TODO: Add ownerAssignedBy and ownerAssignedAt fields to KpiEntity or ownership table
      // TODO: Send notification to new owner

      return {
        success: true,
        message: 'Owner assigned successfully',
        kpiId: dto.kpiId,
        ownerEmployeeNumber: dto.ownerEmployeeNumber,
      };
    } catch (error) {
      this.logger.error(`Error assigning owner: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-015: Assign Shared Owner untuk KPI
   * Assign shared owners to a KPI (vertical support)
   */
  async assignSharedOwners(user: UserContext, dto: AssignSharedOwnerDto) {
    try {
      this.logger.log(`Assigning ${dto.sharedOwnerEmployeeNumbers.length} shared owners to KPI ${dto.kpiId}`);

      const kpi = await this.kpiRepository.findById(dto.kpiId);
      if (!kpi) {
        throw new NotFoundException(`KPI with ID ${dto.kpiId} not found`);
      }

      // Validate contribution percentages
      if (dto.sharedOwnerEmployeeNumbers.length !== dto.contributionPercentages.length) {
        throw new BadRequestException('Number of shared owners must match number of contribution percentages');
      }

      const totalContribution = dto.contributionPercentages.reduce((sum, p) => sum + p, 0);
      if (totalContribution !== 100) {
        throw new BadRequestException(
          `Contribution percentages must sum to 100% (current: ${totalContribution}%)`,
        );
      }

      // TODO: Create ownership records for each Shared Owner
      // TODO: Verify all shared owners exist in MDM
      // TODO: Send notifications to shared owners

      return {
        success: true,
        message: 'Shared owners assigned successfully',
        kpiId: dto.kpiId,
        sharedOwnerCount: dto.sharedOwnerEmployeeNumbers.length,
      };
    } catch (error) {
      this.logger.error(`Error assigning shared owners: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * US-MT-016: Handle Same Position Allocation
   * Handle allocation for multiple incumbents in same position
   */
  async handleSamePositionAllocation(user: UserContext, dto: SamePositionAllocationDto) {
    try {
      this.logger.log(
        `Handling same position allocation for ${dto.incumbentEmployeeNumbers.length} incumbents with ${dto.strategy} strategy`,
      );

      // This is essentially a wrapper around allocateKpiFromTree
      // with specific handling for same position scenario

      const allocationDto: AllocateKpiFromTreeDto = {
        performanceTreeItemId: dto.performanceTreeItemId,
        allocationStrategy: dto.strategy,
        incumbents: dto.incumbentEmployeeNumbers.map((empNum, index) => ({
          employeeNumber: empNum,
          isOwner: dto.strategy === AllocationStrategy.DUPLICATE_KPI ? true : index === 0,
          targetValue: 100, // TODO: Get from user input or tree item
          weight: 20, // TODO: Get from user input
          contributionPercentage: dto.strategy === AllocationStrategy.SHARED_OWNER && index > 0 ? 33 : undefined,
        })),
        notes: dto.rationale,
      };

      return await this.allocateKpiFromTree(user, allocationDto);
    } catch (error) {
      this.logger.error(`Error handling same position allocation: ${error.message}`, error.stack);
      throw error;
    }
  }
}

