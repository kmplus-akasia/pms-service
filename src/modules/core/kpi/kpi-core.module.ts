import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  KpiEntity,
  KpiOwnershipEntity,
  KpiRealizationEntity,
  KpiScoreEntity,
  KpiEmployeePerformanceScoreEntity,
  KpiEmployeePerformanceScoreFinalEntity,
  CohortKpiFormulaEntity,
} from '../../../infrastructure/database/entities';

// Repositories
import { KpiRepository } from './repositories/kpi.repository';
import { RealizationRepository } from './repositories/realization.repository';
import { ScoreRepository } from './repositories/score.repository';
import { EmployeePerformanceScoreRepository } from './repositories/employee-performance-score.repository';
import { EmployeePerformanceScoreFinalRepository } from './repositories/employee-performance-score-final.repository';
import { CohortKpiFormulaRepository } from './repositories/cohort-kpi-formula.repository';

@Module({
  imports: [
    // TypeORM repositories for entities
    TypeOrmModule.forFeature([
      KpiEntity,
      KpiOwnershipEntity,
      KpiRealizationEntity,
      KpiScoreEntity,
      KpiEmployeePerformanceScoreEntity,
      KpiEmployeePerformanceScoreFinalEntity,
      CohortKpiFormulaEntity,
    ]),
  ],
  providers: [
    // Repository providers
    KpiRepository,
    RealizationRepository,
    ScoreRepository,
    EmployeePerformanceScoreRepository,
    EmployeePerformanceScoreFinalRepository,
    CohortKpiFormulaRepository,
  ],
  exports: [
    // Export repositories for use in other modules
    KpiRepository,
    RealizationRepository,
    ScoreRepository,
    EmployeePerformanceScoreRepository,
    EmployeePerformanceScoreFinalRepository,
    CohortKpiFormulaRepository,

    // Export TypeORM repositories if needed
    TypeOrmModule,
  ],
})
export class KpiCoreModule {}
