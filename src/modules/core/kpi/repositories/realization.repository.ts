import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiRealizationEntity, ApprovalStatus, SubmissionStatus, Source } from '../../../../infrastructure/database/entities';

export interface RealizationFilters {
  employeeNumber?: string;
  kpiId?: number;
  year?: number;
  month?: number;
  status?: ApprovalStatus;
  submissionStatus?: SubmissionStatus;
}

@Injectable()
export class RealizationRepository {
  private logger = new Logger(RealizationRepository.name);

  constructor(
    @InjectRepository(KpiRealizationEntity)
    private readonly realizationRepository: Repository<KpiRealizationEntity>,
  ) {}

  /**
   * Create a new realization
   */
  async create(realizationData: Partial<KpiRealizationEntity>): Promise<KpiRealizationEntity> {
    try {
      const realization = this.realizationRepository.create(realizationData);
      const savedRealization = await this.realizationRepository.save(realization);
      this.logger.log(`Realization created: ${savedRealization.kpiRealizationId}`);
      return savedRealization;
    } catch (error) {
      this.logger.error('Failed to create realization', error);
      throw error;
    }
  }

  /**
   * Update realization
   */
  async update(realizationId: number, updateData: Partial<KpiRealizationEntity>): Promise<boolean> {
    try {
      const result = await this.realizationRepository.update(realizationId, {
        ...updateData,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Realization updated: ${realizationId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to update realization: ${realizationId}`, error);
      throw error;
    }
  }

  /**
   * Find realization by ID
   */
  async findById(realizationId: number): Promise<KpiRealizationEntity | null> {
    try {
      return await this.realizationRepository.findOne({
        where: { kpiRealizationId: realizationId },
        relations: ['kpi'],
      });
    } catch (error) {
      this.logger.error(`Failed to find realization by ID: ${realizationId}`, error);
      throw error;
    }
  }

  /**
   * Find realizations with filters
   */
  async findWithFilters(filters: RealizationFilters): Promise<KpiRealizationEntity[]> {
    try {
      const queryBuilder = this.realizationRepository.createQueryBuilder('realization')
        .leftJoinAndSelect('realization.kpi', 'kpi')
        .where('realization.deletedAt IS NULL');

      if (filters.employeeNumber) {
        queryBuilder.andWhere('realization.employeeNumber = :employeeNumber', {
          employeeNumber: filters.employeeNumber,
        });
      }

      if (filters.kpiId) {
        queryBuilder.andWhere('realization.kpiId = :kpiId', { kpiId: filters.kpiId });
      }

      if (filters.year) {
        queryBuilder.andWhere('realization.year = :year', { year: filters.year });
      }

      if (filters.month) {
        queryBuilder.andWhere('realization.month = :month', { month: filters.month });
      }

      if (filters.status) {
        queryBuilder.andWhere('realization.approvalStatus = :status', { status: filters.status });
      }

      if (filters.submissionStatus) {
        queryBuilder.andWhere('realization.submissionStatus = :submissionStatus', {
          submissionStatus: filters.submissionStatus,
        });
      }

      queryBuilder.orderBy('realization.createdAt', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Failed to find realizations with filters', error);
      throw error;
    }
  }

  /**
   * Find pending realizations for user
   */
  async findPendingRealizations(employeeNumber: string): Promise<KpiRealizationEntity[]> {
    try {
      return await this.findWithFilters({
        employeeNumber,
        status: ApprovalStatus.WAITING_FOR_APPROVAL,
        submissionStatus: SubmissionStatus.SUBMITTED,
      });
    } catch (error) {
      this.logger.error(`Failed to find pending realizations for: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Find realizations for KPI
   */
  async findByKpiId(kpiId: number, year?: number): Promise<KpiRealizationEntity[]> {
    try {
      const filters: RealizationFilters = { kpiId };
      if (year) {
        filters.year = year;
      }

      return await this.findWithFilters(filters);
    } catch (error) {
      this.logger.error(`Failed to find realizations for KPI: ${kpiId}`, error);
      throw error;
    }
  }

  /**
   * Approve realization
   */
  async approveRealization(realizationId: number, approverEmployeeNumber: string): Promise<boolean> {
    try {
      const result = await this.realizationRepository.update(realizationId, {
        approvalStatus: ApprovalStatus.APPROVED,
        approverEmployeeNumber,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Realization approved: ${realizationId} by ${approverEmployeeNumber}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to approve realization: ${realizationId}`, error);
      throw error;
    }
  }

  /**
   * Reject realization
   */
  async rejectRealization(
    realizationId: number,
    approverEmployeeNumber: string,
    rejectionNotes: string,
  ): Promise<boolean> {
    try {
      const result = await this.realizationRepository.update(realizationId, {
        approvalStatus: ApprovalStatus.REJECTED,
        approverEmployeeNumber,
        approvalNotes: rejectionNotes,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Realization rejected: ${realizationId} by ${approverEmployeeNumber}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to reject realization: ${realizationId}`, error);
      throw error;
    }
  }

  /**
   * Soft delete realization
   */
  async softDelete(realizationId: number): Promise<boolean> {
    try {
      const result = await this.realizationRepository.update(realizationId, {
        deletedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Realization soft deleted: ${realizationId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to soft delete realization: ${realizationId}`, error);
      throw error;
    }
  }

  /**
   * Get realization statistics
   */
  async getStatistics(employeeNumber: string, year?: number): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    averageAchievement: number;
  }> {
    try {
      const realizations = await this.findWithFilters({
        employeeNumber,
        ...(year && { year }),
      });

      const stats = {
        total: realizations.length,
        approved: 0,
        pending: 0,
        rejected: 0,
        averageAchievement: 0,
      };

      let totalAchievement = 0;
      let achievementCount = 0;

      for (const realization of realizations) {
        switch (realization.approvalStatus) {
          case ApprovalStatus.APPROVED:
            stats.approved++;
            if (realization.realization) {
              totalAchievement += realization.realization;
              achievementCount++;
            }
            break;
          case ApprovalStatus.WAITING_FOR_APPROVAL:
            stats.pending++;
            break;
          case ApprovalStatus.REJECTED:
            stats.rejected++;
            break;
        }
      }

      stats.averageAchievement = achievementCount > 0 ? totalAchievement / achievementCount : 0;

      return stats;
    } catch (error) {
      this.logger.error(`Failed to get realization statistics for: ${employeeNumber}`, error);
      throw error;
    }
  }
}
