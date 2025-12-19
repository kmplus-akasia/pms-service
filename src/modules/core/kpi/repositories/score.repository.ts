import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiScoreEntity, Polarity } from '../../../../infrastructure/database/entities';

export interface ScoreFilters {
  employeeNumber?: string;
  kpiId?: number;
  year?: number;
  month?: number;
  quarter?: number;
}

export interface ScoreCalculationData {
  kpiId: number;
  employeeNumber: string;
  realization: number;
  target: number;
  polarity: Polarity;
  weight: number;
  month: number;
  year: number;
  conclusionDate?: Date;
}

@Injectable()
export class ScoreRepository {
  private logger = new Logger(ScoreRepository.name);

  constructor(
    @InjectRepository(KpiScoreEntity)
    private readonly scoreRepository: Repository<KpiScoreEntity>,
  ) {}

  /**
   * Create a new score record
   */
  async create(scoreData: Partial<KpiScoreEntity>): Promise<KpiScoreEntity> {
    try {
      const score = this.scoreRepository.create(scoreData);
      const savedScore = await this.scoreRepository.save(score);
      this.logger.log(`Score created: ${savedScore.kpiScoreId}`);
      return savedScore;
    } catch (error) {
      this.logger.error('Failed to create score', error);
      throw error;
    }
  }

  /**
   * Update score record
   */
  async update(scoreId: number, updateData: Partial<KpiScoreEntity>): Promise<boolean> {
    try {
      const result = await this.scoreRepository.update(scoreId, {
        ...updateData,
        updatedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Score updated: ${scoreId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to update score: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Find score by ID
   */
  async findById(scoreId: number): Promise<KpiScoreEntity | null> {
    try {
      return await this.scoreRepository.findOne({
        where: { kpiScoreId: scoreId },
        relations: ['kpi'],
      });
    } catch (error) {
      this.logger.error(`Failed to find score by ID: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Find scores with filters
   */
  async findWithFilters(filters: ScoreFilters): Promise<KpiScoreEntity[]> {
    try {
      const queryBuilder = this.scoreRepository.createQueryBuilder('score')
        .leftJoinAndSelect('score.kpi', 'kpi')
        .where('score.deletedAt IS NULL');

      if (filters.employeeNumber) {
        queryBuilder.andWhere('score.employeeNumber = :employeeNumber', {
          employeeNumber: filters.employeeNumber,
        });
      }

      if (filters.kpiId) {
        queryBuilder.andWhere('score.kpiId = :kpiId', { kpiId: filters.kpiId });
      }

      if (filters.year) {
        queryBuilder.andWhere('score.year = :year', { year: filters.year });
      }

      if (filters.month) {
        queryBuilder.andWhere('score.month = :month', { month: filters.month });
      }

      if (filters.quarter) {
        // Calculate quarter from month
        const startMonth = (filters.quarter - 1) * 3 + 1;
        const endMonth = filters.quarter * 3;
        queryBuilder.andWhere('score.month BETWEEN :startMonth AND :endMonth', {
          startMonth,
          endMonth,
        });
      }

      queryBuilder.orderBy('score.year', 'DESC')
        .addOrderBy('score.month', 'DESC')
        .addOrderBy('score.createdAt', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Failed to find scores with filters', error);
      throw error;
    }
  }

  /**
   * Calculate and save score for a KPI realization
   */
  async calculateAndSaveScore(calculationData: ScoreCalculationData): Promise<KpiScoreEntity> {
    try {
      // Calculate achievement percentage
      const achievement = this.calculateAchievement(
        calculationData.realization,
        calculationData.target,
        calculationData.polarity,
      );

      // Calculate weighted score
      const weightedScore = achievement * (calculationData.weight / 100);

      // Check if score already exists for this KPI, employee, month, year
      const existingScore = await this.scoreRepository.findOne({
        where: {
          kpiId: calculationData.kpiId,
          employeeNumber: calculationData.employeeNumber,
          month: calculationData.month,
          year: calculationData.year,
        },
      });

      if (existingScore) {
        // Update existing score
        await this.update(existingScore.kpiScoreId, {
          realization: calculationData.realization,
          target: calculationData.target,
          polarity: calculationData.polarity,
          score: achievement,
          weight: calculationData.weight,
          weightedScore,
          conclusionDate: calculationData.conclusionDate || new Date(),
        });

        this.logger.log(`Score updated for KPI ${calculationData.kpiId}, employee ${calculationData.employeeNumber}`);
        return existingScore;
      } else {
        // Create new score
        return await this.create({
          kpiId: calculationData.kpiId,
          employeeNumber: calculationData.employeeNumber,
          realization: calculationData.realization,
          target: calculationData.target,
          polarity: calculationData.polarity,
          score: achievement,
          weight: calculationData.weight,
          weightedScore,
          month: calculationData.month,
          year: calculationData.year,
          conclusionDate: calculationData.conclusionDate || new Date(),
        });
      }
    } catch (error) {
      this.logger.error('Failed to calculate and save score', error);
      throw error;
    }
  }

  /**
   * Get user scores for dashboard
   */
  async getUserDashboardScores(employeeNumber: string, year?: number): Promise<KpiScoreEntity[]> {
    try {
      return await this.findWithFilters({
        employeeNumber,
        ...(year && { year }),
      });
    } catch (error) {
      this.logger.error(`Failed to get dashboard scores for: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Get KPI score history
   */
  async getKpiScoreHistory(kpiId: number, employeeNumber: string): Promise<KpiScoreEntity[]> {
    try {
      return await this.findWithFilters({
        kpiId,
        employeeNumber,
      });
    } catch (error) {
      this.logger.error(`Failed to get score history for KPI: ${kpiId}, employee: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Get monthly performance summary
   */
  async getMonthlyPerformanceSummary(employeeNumber: string, year: number): Promise<{
    month: number;
    totalScore: number;
    kpiCount: number;
    averageAchievement: number;
  }[]> {
    try {
      const scores = await this.findWithFilters({ employeeNumber, year });

      // Group by month
      const monthlySummary = new Map<number, {
        totalScore: number;
        kpiCount: number;
        totalAchievement: number;
      }>();

      for (const score of scores) {
        const month = score.month!;
        const existing = monthlySummary.get(month) || {
          totalScore: 0,
          kpiCount: 0,
          totalAchievement: 0,
        };

        existing.totalScore += score.weightedScore || 0;
        existing.kpiCount += 1;
        existing.totalAchievement += score.score || 0;

        monthlySummary.set(month, existing);
      }

      // Convert to array
      const result = [];
      for (let month = 1; month <= 12; month++) {
        const data = monthlySummary.get(month);
        result.push({
          month,
          totalScore: data?.totalScore || 0,
          kpiCount: data?.kpiCount || 0,
          averageAchievement: data ? data.totalAchievement / data.kpiCount : 0,
        });
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to get monthly performance summary for: ${employeeNumber}`, error);
      throw error;
    }
  }

  /**
   * Soft delete score
   */
  async softDelete(scoreId: number): Promise<boolean> {
    try {
      const result = await this.scoreRepository.update(scoreId, {
        deletedAt: new Date(),
      });
      const success = result.affected !== undefined && result.affected > 0;
      if (success) {
        this.logger.log(`Score soft deleted: ${scoreId}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to soft delete score: ${scoreId}`, error);
      throw error;
    }
  }

  /**
   * Calculate achievement percentage
   */
  private calculateAchievement(realization: number, target: number, polarity: Polarity): number {
    if (target === 0) return 0;

    if (polarity === 'POSITIVE') {
      // Maximize: (actual / target) × 100
      return Math.min((realization / target) * 100, 200); // Cap at 200% for exceptional performance
    } else {
      // Minimize: (target / actual) × 100
      return (target / realization) * 100;
    }
  }

  /**
   * Bulk calculate scores for multiple KPIs
   */
  async bulkCalculateScores(calculationData: ScoreCalculationData[]): Promise<KpiScoreEntity[]> {
    const results: KpiScoreEntity[] = [];

    for (const data of calculationData) {
      try {
        const score = await this.calculateAndSaveScore(data);
        results.push(score);
      } catch (error) {
        this.logger.error(`Failed to calculate score for KPI ${data.kpiId}`, error);
        // Continue with other calculations
      }
    }

    return results;
  }
}
