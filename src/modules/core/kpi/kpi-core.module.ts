import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  KpiEntity,
  KpiOwnershipEntity,
  KpiRealizationEntity,
  KpiScoreEntity,
} from '../../../infrastructure/database/entities';

// Repositories
import { KpiRepository } from './repositories/kpi.repository';
import { RealizationRepository } from './repositories/realization.repository';
import { ScoreRepository } from './repositories/score.repository';

@Module({
  imports: [
    // TypeORM repositories for entities
    TypeOrmModule.forFeature([
      KpiEntity,
      KpiOwnershipEntity,
      KpiRealizationEntity,
      KpiScoreEntity,
    ]),
  ],
  providers: [
    // Repository providers
    KpiRepository,
    RealizationRepository,
    ScoreRepository,
  ],
  exports: [
    // Export repositories for use in other modules
    KpiRepository,
    RealizationRepository,
    ScoreRepository,

    // Export TypeORM repositories if needed
    TypeOrmModule,
  ],
})
export class KpiCoreModule {}
