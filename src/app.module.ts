import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

// Core modules
import { CoreModule } from './modules/core';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { MyPerformanceModule } from './modules/my-performance';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Infrastructure layer
    DatabaseModule, // TypeORM with entities
    MysqlModule,    // Raw MySQL connections
    RedisModule,    // Redis caching
    RabbitMQModule, // Message queuing
    FileModule,     // File storage operations
    MonitoringModule, // Health checks and monitoring
    AuthModule,     // Authentication and authorization

    // Core domain modules
    CoreModule,     // Shared repositories for KPI operations

    // Feature modules
    MyPerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
