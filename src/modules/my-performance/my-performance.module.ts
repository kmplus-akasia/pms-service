import { Module } from '@nestjs/common';

// Controllers
import { MyPerformanceController } from './controllers/my-performance.controller';

// Services
import { MyPerformanceService } from './services/my-performance.service';



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
  ],
  exports: [
    MyPerformanceService,
  ],
})
export class MyPerformanceModule {}
