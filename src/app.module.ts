import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Infrastructure modules
import {
  DatabaseModule,
  MysqlModule,
  RedisModule,
  RabbitMQModule,
  FileModule,
  MonitoringModule,
} from './infrastructure';

// Feature modules
import { AuthModule } from './modules/auth';
import { MyPerformanceModule } from './modules/my-performance';

@Module({
  imports: [
    // Infrastructure layer
    DatabaseModule, // TypeORM with entities
    MysqlModule,    // Raw MySQL connections
    RedisModule,    // Redis caching
    RabbitMQModule, // Message queuing
    FileModule,     // File storage operations
    MonitoringModule, // Health checks and monitoring
    AuthModule,     // Authentication and authorization

    // Feature modules
    MyPerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
