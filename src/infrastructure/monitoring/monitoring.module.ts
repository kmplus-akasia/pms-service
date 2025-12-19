import { Module, Global } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { MysqlModule } from '../database/mysql.module';
import { RedisModule } from '../cache/redis.module';
import { RabbitMQModule } from '../queue/rabbitmq.module';

@Global()
@Module({
  imports: [MysqlModule, RedisModule, RabbitMQModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class MonitoringModule {}
