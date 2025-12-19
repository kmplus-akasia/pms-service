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
} from '../infrastructure/database/entities';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  synchronize: process.env.NODE_ENV === 'development', // Only in development
  logging: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
  maxQueryExecutionTime: 1000, // Log slow queries
  extra: {
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    acquireTimeout: 60000,
    timeout: 60000,
  },
};

export const getTypeormConfig = (): TypeOrmModuleOptions => {
  // Validate required environment variables
  const requiredEnvVars = ['DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required database environment variables: ${missingVars.join(', ')}`
    );
  }

  return typeormConfig;
};
