import { Module } from '@nestjs/common';
import { MyTeamPerformanceController } from './controllers/my-team-performance.controller';
import { MyTeamPerformanceService } from './services/my-team-performance.service';
import { ApprovalService } from './services/approval.service';
import { CascadeService } from './services/cascade.service';
import { AllocationService } from './services/allocation.service';

// Import core KPI module for repositories
import { KpiCoreModule } from '../core/kpi/kpi-core.module';

// Import infrastructure modules
import { RedisModule } from '../../infrastructure/cache/redis.module';

@Module({
  imports: [
    KpiCoreModule, // Provides KPI repositories
    RedisModule,
  ],
  controllers: [MyTeamPerformanceController],
  providers: [
    MyTeamPerformanceService,
    ApprovalService,
    CascadeService,
    AllocationService,
  ],
  exports: [MyTeamPerformanceService],
})
export class MyTeamPerformanceModule {}

