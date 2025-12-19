import { Injectable, Logger } from '@nestjs/common';
import { MysqlService } from '../database/mysql.service';
import { RedisService } from '../cache/redis.service';
import { RabbitMQService } from '../queue/rabbitmq.service';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    rabbitmq: 'up' | 'down';
  };
  version?: string;
}

export interface DetailedHealthStatus extends HealthStatus {
  details: {
    database: {
      connectionInfo: any;
      queryTime?: number;
    };
    redis: {
      connectionInfo: any;
      pingTime?: number;
    };
    rabbitmq: {
      connectionInfo: any;
      testTime?: number;
    };
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  environment: string;
}

@Injectable()
export class HealthService {
  private logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(
    private readonly mysqlService: MysqlService,
    private readonly redisService: RedisService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  /**
   * Get overall application health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const [dbHealth, redisHealth, rabbitHealth] = await Promise.allSettled([
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
      this.checkRabbitMQHealth(),
    ]);

    const services = {
      database: (dbHealth.status === 'fulfilled' && dbHealth.value ? 'up' : 'down') as 'up' | 'down',
      redis: (redisHealth.status === 'fulfilled' && redisHealth.value ? 'up' : 'down') as 'up' | 'down',
      rabbitmq: (rabbitHealth.status === 'fulfilled' && rabbitHealth.value ? 'up' : 'down') as 'up' | 'down',
    };

    const allHealthy = Object.values(services).every(status => status === 'up');
    const status: HealthStatus = {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      services,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Log unhealthy services
    if (!allHealthy) {
      const unhealthyServices = Object.entries(services)
        .filter(([, status]) => status === 'down')
        .map(([service]) => service);

      this.logger.warn(`Health check failed for services: ${unhealthyServices.join(', ')}`);
    }

    return status;
  }

  /**
   * Get detailed health information
   */
  async getDetailedHealth(): Promise<DetailedHealthStatus> {
    const basicHealth = await this.getHealthStatus();

    const [dbDetails, redisDetails, rabbitDetails] = await Promise.allSettled([
      this.getDatabaseDetails(),
      this.getRedisDetails(),
      this.getRabbitMQDetails(),
    ]);

    const detailedHealth: DetailedHealthStatus = {
      ...basicHealth,
      details: {
        database: dbDetails.status === 'fulfilled' ? dbDetails.value : { connectionInfo: null },
        redis: redisDetails.status === 'fulfilled' ? redisDetails.value : { connectionInfo: null },
        rabbitmq: rabbitDetails.status === 'fulfilled' ? rabbitDetails.value : { connectionInfo: null },
      },
      memory: this.getMemoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    };

    return detailedHealth;
  }

  /**
   * Get database health
   */
  async getDatabaseHealth(): Promise<any> {
    try {
      const isHealthy = await this.mysqlService.healthCheck();
      const connectionInfo = this.mysqlService.getConnectionInfo();

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        connectionInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get cache health
   */
  async getCacheHealth(): Promise<any> {
    try {
      const isHealthy = await this.redisService.healthCheck();
      const connectionInfo = this.redisService.getClientInfo();

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        connectionInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get queue health
   */
  async getQueueHealth(): Promise<any> {
    try {
      const isHealthy = await this.rabbitMQService.healthCheck();
      const connectionInfo = this.rabbitMQService.getConnectionInfo();

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        connectionInfo,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('RabbitMQ health check failed', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      return await this.mysqlService.healthCheck();
    } catch (error) {
      return false;
    }
  }

  private async checkRedisHealth(): Promise<boolean> {
    try {
      return await this.redisService.healthCheck();
    } catch (error) {
      return false;
    }
  }

  private async checkRabbitMQHealth(): Promise<boolean> {
    try {
      return await this.rabbitMQService.healthCheck();
    } catch (error) {
      return false;
    }
  }

  private async getDatabaseDetails(): Promise<any> {
    const startTime = Date.now();
    const connectionInfo = this.mysqlService.getConnectionInfo();

    try {
      await this.mysqlService.query('SELECT 1');
      const queryTime = Date.now() - startTime;

      return {
        connectionInfo,
        queryTime,
      };
    } catch (error) {
      return {
        connectionInfo,
        error: error.message,
      };
    }
  }

  private async getRedisDetails(): Promise<any> {
    const startTime = Date.now();
    const connectionInfo = this.redisService.getClientInfo();

    try {
      await this.redisService.ping();
      const pingTime = Date.now() - startTime;

      return {
        connectionInfo,
        pingTime,
      };
    } catch (error) {
      return {
        connectionInfo,
        error: error.message,
      };
    }
  }

  private async getRabbitMQDetails(): Promise<any> {
    const startTime = Date.now();
    const connectionInfo = this.rabbitMQService.getConnectionInfo();

    try {
      await this.rabbitMQService.healthCheck();
      const testTime = Date.now() - startTime;

      return {
        connectionInfo,
        testTime,
      };
    } catch (error) {
      return {
        connectionInfo,
        error: error.message,
      };
    }
  }

  private getMemoryUsage(): { used: number; total: number; percentage: number } {
    const memUsage = process.memoryUsage();
    const used = Math.round(memUsage.heapUsed / 1024 / 1024); // MB
    const total = Math.round(memUsage.heapTotal / 1024 / 1024); // MB
    const percentage = Math.round((used / total) * 100);

    return { used, total, percentage };
  }
}
