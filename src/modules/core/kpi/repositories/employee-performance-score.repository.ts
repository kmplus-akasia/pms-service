import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiEmployeePerformanceScoreEntity } from '../../../../infrastructure/database/entities';

export interface EmployeePerformanceScoreFilters {
  employeeNumber?: string;
  year?: number;
  month?: number;
  aggregationDate?: Date;
}

export interface EmployeePerformanceScoreSummary {
  employeeNumber: string;
  year: number;
  month?: number;
  finalScore: number;
  kpiScore: number;
  outputScore: number;
  impactScore: number;
  boundaryScore: number;
  kpiScoreWeight: number;
  outputScoreWeight: number;
  impactScoreWeight: number;
  aggregationDate: Date;
}

@Injectable()
export class EmployeePerformanceScoreRepository {
  private logger = new Logger(EmployeePerformanceScoreRepository.name);

  constructor(
    @InjectRepository(KpiEmployeePerformanceScoreEntity)
    private readonly performanceScoreRepository: Repository<KpiEmployeePerformanceScoreEntity>,
  ) {}

  /**
   * Create a new employee performance score record
   */
  async create(scoreData: Partial<KpiEmployeePerformanceScoreEntity>): Promise<KpiEmployeePerformanceScoreEntity> {
    try {
      const score = this.performanceScoreRepository.create(scoreData);
      const savedScore = await this.performanceScoreRepository.save(score);
      this.logger.log(`Employee performance score created: ${savedScore.kpiEmployeePerformanceScoreId}`);
      return savedScore;
    } catch (error) {
      this.logger.error('Failed to create employee performance score', error);
      throw error;
    }
  }

  /**
   * Update employee performance score record
   */
  async update(scoreId: number, updateData: Partial<KpiEmployeePerformanceScoreEntity>): Promise<boolean> {
    try {
      const result = await this.performanceScoreRepository.update(scoreId, {
        ...updateData,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Employee performance score updated: ${scoreId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to update employee performance score: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Find performance score by ID
   */
  async findById(scoreId: number): Promise<KpiEmployeePerformanceScoreEntity | null> {
    try {
      return await this.performanceScoreRepository.findOne({
        where: { kpiEmployeePerformanceScoreId: scoreId },
        relations: ['cohortKpiFormula'],
      });
    } catch (error) {
      this.logger.error(`Failed to find employee performance score by ID: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Find performance scores with filters
   */
  async findWithFilters(filters: EmployeePerformanceScoreFilters): Promise<KpiEmployeePerformanceScoreEntity[]> {
    try {
      const queryBuilder = this.performanceScoreRepository.createQueryBuilder('score')
        .leftJoinAndSelect('score.cohortKpiFormula', 'formula')
        .where('score.deletedAt IS NULL');

      if (filters.employeeNumber) {
        queryBuilder.andWhere('score.employeeNumber = :employeeNumber', {
          employeeNumber: filters.employeeNumber,
        });
      }

      if (filters.year) {
        queryBuilder.andWhere('score.year = :year', { year: filters.year });
      }

      if (filters.month) {
        queryBuilder.andWhere('score.month = :month', { month: filters.month });
      }

      if (filters.aggregationDate) {
        queryBuilder.andWhere('score.aggregationDate = :aggregationDate', {
          aggregationDate: filters.aggregationDate,
        });
      }

      queryBuilder.orderBy('score.year', 'DESC')
        .addOrderBy('score.month', 'DESC')
        .addOrderBy('score.aggregationDate', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Failed to find employee performance scores with filters', error);
      throw error;
    }
  }

  /**
   * Get latest performance score for an employee
   */
  async getLatestScore(employeeNumber: string): Promise<KpiEmployeePerformanceScoreEntity | null> {
    try {
      return await this.performanceScoreRepository.findOne({
        where: { employeeNumber, deletedAt: undefined },
        relations: ['cohortKpiFormula'],
        order: {
          year: 'DESC',
          month: 'DESC',
          aggregationDate: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to get latest score for employee: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Get performance score summary for dashboard
   */
  async getScoreSummary(employeeNumber: string, year?: number): Promise<EmployeePerformanceScoreSummary[]> {
    try {
      const scores = await this.findWithFilters({
        employeeNumber,
        ...(year && { year }),
      });

      return scores.map(score => ({
        employeeNumber: score.employeeNumber,
        year: score.year!,
        month: score.month,
        finalScore: score.finalScore || 0,
        kpiScore: score.kpiScore || 0,
        outputScore: score.outputScore || 0,
        impactScore: score.impactScore || 0,
        boundaryScore: score.boundaryScore || 0,
        kpiScoreWeight: score.kpiScoreWeight || 0,
        outputScoreWeight: score.outputScoreWeight || 0,
        impactScoreWeight: score.impactScoreWeight || 0,
        aggregationDate: score.aggregationDate!,
      }));
    } catch (error) {
      this.logger.error(`Failed to get score summary for employee: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Soft delete performance score
   */
  async softDelete(scoreId: number): Promise<boolean> {
    try {
      const result = await this.performanceScoreRepository.update(scoreId, {
        deletedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Employee performance score soft deleted: ${scoreId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to soft delete employee performance score: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Calculate and save employee performance score
   */
  async calculateAndSaveScore(
    employeeNumber: string,
    year: number,
    month: number,
    cohortKpiFormulaId: number,
    scoreData: {
      finalScore?: number;
      kpiScore?: number;
      outputScore?: number;
      impactScore?: number;
      boundaryScore?: number;
      kpiScoreWeight?: number;
      outputScoreWeight?: number;
      impactScoreWeight?: number;
      kpiKpiIds?: string;
      outputKpiIds?: string;
      impactKpiIds?: string;
    }
  ): Promise<KpiEmployeePerformanceScoreEntity> {
    try {
      // Check if score already exists
      const existingScore = await this.performanceScoreRepository.findOne({
        where: {
          employeeNumber,
          year,
          month,
        },
      });

      const scorePayload = {
        ...scoreData,
        cohortKpiFormulaId,
        aggregationDate: new Date(year, month - 1, 1), // First day of the month
      };

      if (existingScore) {
        // Update existing score
        await this.update(existingScore.kpiEmployeePerformanceScoreId, scorePayload);
        this.logger.log(`Employee performance score updated for ${employeeNumber}, ${year}-${month}`);
        return existingScore;
      } else {
        // Create new score
        return await this.create({
          employeeNumber,
          year,
          month,
          ...scorePayload,
        });
      }
    } catch (error) {
      this.logger.error(`Failed to calculate and save employee performance score for ${employeeNumber}`, error);
      throw error;
    }
  }
}
