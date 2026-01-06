import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CohortKpiFormulaEntity } from '../../../../infrastructure/database/entities';

export interface CohortKpiFormulaFilters {
  cohortId?: number;
  version?: number;
}

@Injectable()
export class CohortKpiFormulaRepository {
  private logger = new Logger(CohortKpiFormulaRepository.name);

  constructor(
    @InjectRepository(CohortKpiFormulaEntity)
    private readonly formulaRepository: Repository<CohortKpiFormulaEntity>,
  ) {}

  /**
   * Find formula by filters
   */
  async findWithFilters(filters: CohortKpiFormulaFilters): Promise<CohortKpiFormulaEntity[]> {
    try {
      const queryBuilder = this.formulaRepository.createQueryBuilder('formula')
        .where('formula.deletedAt IS NULL');

      if (filters.cohortId) {
        queryBuilder.andWhere('formula.cohortId = :cohortId', {
          cohortId: filters.cohortId,
        });
      }

      if (filters.version) {
        queryBuilder.andWhere('formula.version = :version', { version: filters.version });
      }

      queryBuilder.orderBy('formula.version', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Failed to find cohort KPI formulas with filters', error);
      throw error;
    }
  }

  /**
   * Get latest formula for a cohort
   */
  async getLatestFormulaForCohort(cohortId: number): Promise<CohortKpiFormulaEntity | null> {
    try {
      return await this.formulaRepository.findOne({
        where: { cohortId, deletedAt: undefined },
        order: { version: 'DESC' },
        relations: ['cohort'],
      });
    } catch (error) {
      this.logger.error(`Failed to get latest formula for cohort: ${cohortId}`, error);
      throw error;
    }
  }

  /**
   * Create a new formula
   */
  async create(formulaData: Partial<CohortKpiFormulaEntity>): Promise<CohortKpiFormulaEntity> {
    try {
      const formula = this.formulaRepository.create(formulaData);
      const savedFormula = await this.formulaRepository.save(formula);
      this.logger.log(`Cohort KPI formula created: ${savedFormula.cohortKpiFormulaId}`);
      return savedFormula;
    } catch (error) {
      this.logger.error('Failed to create cohort KPI formula', error);
      throw error;
    }
  }
}
