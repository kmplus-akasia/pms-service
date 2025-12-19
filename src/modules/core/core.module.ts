import { Module } from '@nestjs/common';

// Core domain modules
import { KpiCoreModule } from './kpi/kpi-core.module';

@Module({
  imports: [
    // KPI domain - shared across multiple feature modules
    KpiCoreModule,
  ],
  exports: [
    // Export all core modules for use in feature modules
    KpiCoreModule,
  ],
})
export class CoreModule {}
