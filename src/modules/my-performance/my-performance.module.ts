import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { MyPerformanceController } from './controllers/my-performance.controller';

// Services
import { MyPerformanceService } from './services/my-performance.service';

// Guards
import { OwnershipGuard } from './guards/ownership.guard';

// Infrastructure dependencies
import {
  MysqlModule,
  RedisModule,
  FileModule,
} from '../../infrastructure';

// Entities
import {
  KpiEntity,
  KpiOwnershipEntity,
  KpiRealizationEntity,
  KpiScoreEntity,
} from '../../infrastructure/database/entities';

@Module({
  imports: [
    // Infrastructure modules
    MysqlModule,
    RedisModule,
    FileModule,

    // TypeORM repositories
    TypeOrmModule.forFeature([
      KpiEntity,
      KpiOwnershipEntity,
      KpiRealizationEntity,
      KpiScoreEntity,
    ]),
  ],
  controllers: [MyPerformanceController],
  providers: [
    MyPerformanceService,
    OwnershipGuard,
  ],
  exports: [
    MyPerformanceService,
    OwnershipGuard,
  ],
})
export class MyPerformanceModule {}
