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

@Module({
  imports: [
    // Infrastructure layer
    DatabaseModule, // TypeORM with entities
    MysqlModule,    // Raw MySQL connections
    RedisModule,    // Redis caching
    RabbitMQModule, // Message queuing
    FileModule,     // File storage operations
    MonitoringModule, // Health checks and monitoring

    // Feature modules will be added here
    // AuthModule, MyPerformanceModule, TeamModule, etc.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
