import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  KpiEntity,
  KpiOwnershipEntity,
  KpiRealizationEntity,
  KpiScoreEntity,
  PositionCohortEntity,
  CohortKpiFormulaEntity,
  KpiEmployeePerformanceScoreEntity,
  KpiPositionPerformanceScoreEntity,
  KpiEmployeePerformanceScoreFinalEntity,
  KpiPositionPerformanceScoreFinalEntity,
  KpiScheduleEntity,
  KpiLogEntity,
  CohortKpiFormulaLogEntity,
} from './entities';
import { ConfigService } from '@nestjs/config';

export const getTypeormConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT') || '3306', 10),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [
    KpiEntity,
    KpiOwnershipEntity,
    KpiRealizationEntity,
    KpiScoreEntity,
    PositionCohortEntity,
    CohortKpiFormulaEntity,
    KpiEmployeePerformanceScoreEntity,
    KpiPositionPerformanceScoreEntity,
    KpiEmployeePerformanceScoreFinalEntity,
    KpiPositionPerformanceScoreFinalEntity,
    KpiScheduleEntity,
    KpiLogEntity,
    CohortKpiFormulaLogEntity,
  ],
  synchronize: configService.get('NODE_ENV') === 'development', // Only in development
  logging: configService.get('NODE_ENV') === 'development',
  logger: 'advanced-console',
  maxQueryExecutionTime: 1000, // Log slow queries
  extra: {
    connectionLimit: parseInt(configService.get('DB_CONNECTION_LIMIT') || '10', 10),
    acquireTimeout: 60000,
    timeout: 60000,
  },
});

