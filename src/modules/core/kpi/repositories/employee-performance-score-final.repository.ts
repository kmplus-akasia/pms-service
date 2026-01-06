import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiEmployeePerformanceScoreFinalEntity } from '../../../../infrastructure/database/entities';

export interface EmployeePerformanceScoreFinalFilters {
  employeeNumber?: string;
  year?: number;
  quarter?: number;
}

export interface EmployeePerformanceScoreFinalSummary {
  employeeNumber: string;
  year: number;
  quarter: number;
  performanceScoreFinal: number;
  performanceScoreBase: number;
  additionScore: number;
  boundaryScore: number;
}

@Injectable()
export class EmployeePerformanceScoreFinalRepository {
  private logger = new Logger(EmployeePerformanceScoreFinalRepository.name);

  constructor(
    @InjectRepository(KpiEmployeePerformanceScoreFinalEntity)
    private readonly finalScoreRepository: Repository<KpiEmployeePerformanceScoreFinalEntity>,
  ) {}

  /**
   * Create a new employee performance score final record
   */
  async create(scoreData: Partial<KpiEmployeePerformanceScoreFinalEntity>): Promise<KpiEmployeePerformanceScoreFinalEntity> {
    try {
      const score = this.finalScoreRepository.create(scoreData);
      const savedScore = await this.finalScoreRepository.save(score);
      this.logger.log(`Employee performance score final created: ${savedScore.kpiEmployeePerformanceScoreFinalId}`);
      return savedScore;
    } catch (error) {
      this.logger.error('Failed to create employee performance score final', error);
      throw error;
    }
  }

  /**
   * Update employee performance score final record
   */
  async update(scoreId: number, updateData: Partial<KpiEmployeePerformanceScoreFinalEntity>): Promise<boolean> {
    try {
      const result = await this.finalScoreRepository.update(scoreId, {
        ...updateData,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Employee performance score final updated: ${scoreId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to update employee performance score final: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Find performance score final by ID
   */
  async findById(scoreId: number): Promise<KpiEmployeePerformanceScoreFinalEntity | null> {
    try {
      return await this.finalScoreRepository.findOne({
        where: { kpiEmployeePerformanceScoreFinalId: scoreId },
      });
    } catch (error) {
      this.logger.error(`Failed to find employee performance score final by ID: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Find performance score finals with filters
   */
  async findWithFilters(filters: EmployeePerformanceScoreFinalFilters): Promise<KpiEmployeePerformanceScoreFinalEntity[]> {
    try {
      const queryBuilder = this.finalScoreRepository.createQueryBuilder('score')
        .where('score.deletedAt IS NULL');

      if (filters.employeeNumber) {
        queryBuilder.andWhere('score.employeeNumber = :employeeNumber', {
          employeeNumber: filters.employeeNumber,
        });
      }

      if (filters.year) {
        queryBuilder.andWhere('score.year = :year', { year: filters.year });
      }

      if (filters.quarter) {
        queryBuilder.andWhere('score.quarter = :quarter', { quarter: filters.quarter });
      }

      queryBuilder.orderBy('score.year', 'DESC')
        .addOrderBy('score.quarter', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Failed to find employee performance score finals with filters', error);
      throw error;
    }
  }

  /**
   * Get latest performance score final for an employee
   */
  async getLatestScore(employeeNumber: string): Promise<KpiEmployeePerformanceScoreFinalEntity | null> {
    try {
      return await this.finalScoreRepository.findOne({
        where: { employeeNumber, deletedAt: undefined },
        order: {
          year: 'DESC',
          quarter: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to get latest final score for employee: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Get performance score final summary
   */
  async getScoreFinalSummary(employeeNumber: string, year?: number): Promise<EmployeePerformanceScoreFinalSummary[]> {
    try {
      const scores = await this.findWithFilters({
        employeeNumber,
        ...(year && { year }),
      });

      return scores.map(score => ({
        employeeNumber: score.employeeNumber,
        year: score.year!,
        quarter: score.quarter!,
        performanceScoreFinal: score.performanceScoreFinal || 0,
        performanceScoreBase: score.performanceScoreBase || 0,
        additionScore: score.additionScore || 0,
        boundaryScore: score.boundaryScore || 0,
      }));
    } catch (error) {
      this.logger.error(`Failed to get final score summary for employee: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Calculate and save employee performance score final
   */
  async calculateAndSaveScore(
    employeeNumber: string,
    year: number,
    quarter: number,
    scoreData: {
      performanceScoreFinal?: number;
      performanceScoreBase?: number;
      additionScore?: number;
      boundaryScore?: number;
    }
  ): Promise<KpiEmployeePerformanceScoreFinalEntity> {
    try {
      // Check if score already exists
      const existingScore = await this.finalScoreRepository.findOne({
        where: {
          employeeNumber,
          year,
          quarter,
        },
      });

      if (existingScore) {
        // Update existing score
        await this.update(existingScore.kpiEmployeePerformanceScoreFinalId, scoreData);
        this.logger.log(`Employee performance score final updated for ${employeeNumber}, Q${quarter} ${year}`);
        return existingScore;
      } else {
        // Create new score
        return await this.create({
          employeeNumber,
          year,
          quarter,
          ...scoreData,
        });
      }
    } catch (error) {
      this.logger.error(`Failed to calculate and save employee performance score final for ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Soft delete performance score final
   */
  async softDelete(scoreId: number): Promise<boolean> {
    try {
      const result = await this.finalScoreRepository.update(scoreId, {
        deletedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Employee performance score final soft deleted: ${scoreId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to soft delete employee performance score final: ${scoreId}`, error);
      throw error;
    }
  }
}
