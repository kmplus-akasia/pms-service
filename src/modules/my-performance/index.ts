// Module
export { MyPerformanceModule } from './my-performance.module';

// Controllers
export { MyPerformanceController } from './controllers/my-performance.controller';

// Services
export { MyPerformanceService } from './services/my-performance.service';

// Guards
export { OwnershipGuard, RequireOwnership, RequireOwner, RequireCanEdit, RequireCanInputRealization, AllowSharedOwner } from './guards/ownership.guard';

// DTOs
export { CreateKpiDto } from './dto/create-kpi.dto';
export { SubmitRealizationDto } from './dto/submit-realization.dto';
export { KpiResponseDto } from './dto/kpi-response.dto';
export { DashboardResponseDto } from './dto/dashboard.response.dto';

// Enums (for convenience)
export {
  KpiType,
  NatureOfWork,
  Polarity,
  TargetType,
  CascadingMethod,
  BscPerspective,
  MonitoringFrequency,
} from './dto/create-kpi.dto';

export { RealizationType } from './dto/submit-realization.dto';

export { KpiStatus, MonitoringStatus } from './dto/kpi-response.dto';

export { PeriodType } from './dto/dashboard.response.dto';
