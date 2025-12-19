import { Module } from '@nestjs/common';

// Controllers
import { MyPerformanceController } from './controllers/my-performance.controller';

// Services
import { MyPerformanceService } from './services/my-performance.service';

// Repositories
import { KpiRepository } from './repositories/kpi.repository';
import { RealizationRepository } from './repositories/realization.repository';
import { ScoreRepository } from './repositories/score.repository';

// Guards
import { OwnershipGuard } from './guards/ownership.guard';

// Infrastructure dependencies
import {
  MysqlModule,
  RedisModule,
  FileModule,
} from '../../infrastructure';

// Core modules
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    // Infrastructure modules
    MysqlModule,
    RedisModule,
    FileModule,

    // Core domain modules
    CoreModule,
  ],
  controllers: [MyPerformanceController],
  providers: [
    // Services
    MyPerformanceService,

    // Guards
    OwnershipGuard,
  ],
  exports: [
    MyPerformanceService,
    OwnershipGuard,
  ],
})
export class MyPerformanceModule {}
