import { Module } from '@nestjs/common';

// Core domain modules
import { KpiCoreModule } from './kpi/kpi-core.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [
    // KPI domain - shared across multiple feature modules
    KpiCoreModule,
    // Position domain - shared across multiple feature modules
    PositionModule,
  ],
  exports: [
    // Export all core modules for use in feature modules
    KpiCoreModule,
    PositionModule,
  ],
})
export class CoreModule {}
