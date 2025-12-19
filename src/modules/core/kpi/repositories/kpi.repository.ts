import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiEntity, KpiOwnershipEntity, ItemApprovalStatus, KpiType } from '../../../../infrastructure/database/entities';

export interface KpiWithOwnership {
  kpi: KpiEntity;
  ownership: KpiOwnershipEntity;
  isOwner: boolean;
  canEdit: boolean;
  canInputRealization: boolean;
}

export interface KpiFilters {
  employeeNumber?: string;
  status?: ItemApprovalStatus;
  type?: KpiType;
  year?: number;
  isActive?: boolean;
}

@Injectable()
export class KpiRepository {
  private logger = new Logger(KpiRepository.name);

  constructor(
    @InjectRepository(KpiEntity)
    private readonly kpiRepository: Repository<KpiEntity>,
    @InjectRepository(KpiOwnershipEntity)
    private readonly ownershipRepository: Repository<KpiOwnershipEntity>,
  ) {}

  /**
   * Create a new KPI
   */
  async create(kpiData: Partial<KpiEntity>): Promise<KpiEntity> {
    try {
      const kpi = this.kpiRepository.create(kpiData);
      const savedKpi = await this.kpiRepository.save(kpi);
      this.logger.log(`KPI created: ${savedKpi.kpiId}`);
      return savedKpi;
    } catch (error) {
      this.logger.error('Failed to create KPI', error);
      throw error;
    }
  }

  /**
   * Update KPI
   */
  async update(kpiId: number, updateData: Partial<KpiEntity>): Promise<boolean> {
    try {
      const result = await this.kpiRepository.update(kpiId, {
        ...updateData,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`KPI updated: ${kpiId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to update KPI: ${kpiId}`, error);
      throw error;
    }
  }

  /**
   * Find KPI by ID
   */
  async findById(kpiId: number): Promise<KpiEntity | null> {
    try {
      return await this.kpiRepository.findOne({
        where: { kpiId, isActive: true },
      });
    } catch (error) {
      this.logger.error(`Failed to find KPI by ID: ${kpiId}`, error);
      throw error;
    }
  }

  /**
   * Find KPIs with filters
   */
  async findWithFilters(filters: KpiFilters): Promise<KpiEntity[]> {
    try {
      const queryBuilder = this.kpiRepository.createQueryBuilder('kpi')
        .where('kpi.isActive = :isActive', { isActive: filters.isActive ?? true });

      if (filters.status) {
        queryBuilder.andWhere('kpi.itemApprovalStatus = :status', { status: filters.status });
      }

      if (filters.type) {
        queryBuilder.andWhere('kpi.type = :type', { type: filters.type });
      }

      if (filters.year) {
        // Join with ownership to filter by year
        queryBuilder
          .innerJoin('kpi.ownerships', 'ownership')
          .andWhere('ownership.year = :year', { year: filters.year });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Failed to find KPIs with filters', error);
      throw error;
    }
  }

  /**
   * Find user's KPIs with ownership information
   */
  async findUserKpisWithOwnership(employeeNumber: string): Promise<KpiWithOwnership[]> {
    try {
      const ownerships = await this.ownershipRepository.find({
        where: { employeeNumber },
        relations: ['kpi'],
      });

      return ownerships
        .filter(ownership => ownership.kpi?.isActive)
        .map(ownership => {
          const isOwner = ownership.ownershipType === 'OWNER';
          const canEdit = isOwner && ownership.kpi.itemApprovalStatus === ItemApprovalStatus.DRAFT;
          const canInputRealization = isOwner;

          return {
            kpi: ownership.kpi,
            ownership,
            isOwner,
            canEdit,
            canInputRealization,
          };
        });
    } catch (error) {
      this.logger.error(`Failed to find user KPIs for: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Find KPI with ownership check
   */
  async findKpiWithOwnershipCheck(kpiId: number, employeeNumber: string): Promise<KpiWithOwnership | null> {
    try {
      const ownership = await this.ownershipRepository.findOne({
        where: { kpiId, employeeNumber },
        relations: ['kpi'],
      });

      if (!ownership || !ownership.kpi?.isActive) {
        return null;
      }

      const isOwner = ownership.ownershipType === 'OWNER';
      const canEdit = isOwner && ownership.kpi.itemApprovalStatus === ItemApprovalStatus.DRAFT;
      const canInputRealization = isOwner;

      return {
        kpi: ownership.kpi,
        ownership,
        isOwner,
        canEdit,
        canInputRealization,
      };
    } catch (error) {
      this.logger.error(`Failed to find KPI with ownership check: ${kpiId}, ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Soft delete KPI
   */
  async softDelete(kpiId: number): Promise<boolean> {
    try {
      const result = await this.kpiRepository.update(kpiId, {
        isActive: false,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`KPI soft deleted: ${kpiId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to soft delete KPI: ${kpiId}`, error);
      throw error;
    }
  }

  /**
   * Get KPI statistics for dashboard
   */
  async getDashboardStats(employeeNumber: string): Promise<{
    total: number;
    draft: number;
    pendingApproval: number;
    approved: number;
    rejected: number;
    onTrack: number;
    atRisk: number;
    behind: number;
    pending: number;
  }> {
    try {
      const userKpis = await this.findUserKpisWithOwnership(employeeNumber);

      const stats = {
        total: userKpis.length,
        draft: 0,
        pendingApproval: 0,
        approved: 0,
        rejected: 0,
        onTrack: 0, // TODO: Implement monitoring status tracking
        atRisk: 0,
        behind: 0,
        pending: 0,
      };

      for (const kpiWithOwnership of userKpis) {
        const status = kpiWithOwnership.kpi.itemApprovalStatus;
        switch (status) {
          case ItemApprovalStatus.DRAFT:
            stats.draft++;
            break;
          case ItemApprovalStatus.WAITING_FOR_APPROVAL:
            stats.pendingApproval++;
            break;
          case ItemApprovalStatus.APPROVED:
            stats.approved++;
            break;
          case ItemApprovalStatus.REJECTED:
            stats.rejected++;
            break;
        }
      }

      return stats;
    } catch (error) {
      this.logger.error(`Failed to get dashboard stats for: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Create ownership record
   */
  async createOwnership(ownershipData: Partial<KpiOwnershipEntity>): Promise<KpiOwnershipEntity> {
    try {
      const ownership = this.ownershipRepository.create(ownershipData);
      const savedOwnership = await this.ownershipRepository.save(ownership);
      this.logger.log(`KPI ownership created: ${savedOwnership.kpiOwnershipId}`);
      return savedOwnership;
    } catch (error) {
      this.logger.error('Failed to create KPI ownership', error);
      throw error;
    }
  }

  /**
   * Update ownership record
   */
  async updateOwnership(ownershipId: number, updateData: Partial<KpiOwnershipEntity>): Promise<boolean> {
    try {
      const result = await this.ownershipRepository.update(ownershipId, {
        ...updateData,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`KPI ownership updated: ${ownershipId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to update KPI ownership: ${ownershipId}`, error);
      throw error;
    }
  }
}
