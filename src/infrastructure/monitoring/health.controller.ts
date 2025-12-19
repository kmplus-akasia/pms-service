import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Get application health status',
    description: 'Returns the overall health status of the application and its dependencies'
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', example: '2025-01-15T10:30:00Z' },
        uptime: { type: 'number', example: 3600 },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'up' },
            redis: { type: 'string', example: 'up' },
            rabbitmq: { type: 'string', example: 'up' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Application is unhealthy',
  })
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('detailed')
  @ApiOperation({
    summary: 'Get detailed health information',
    description: 'Returns detailed health information including metrics and connection details'
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed health information retrieved',
  })
  async getDetailedHealth() {
    return this.healthService.getDetailedHealth();
  }

  @Get('database')
  @ApiOperation({
    summary: 'Check database connectivity',
    description: 'Tests database connection and returns connection details'
  })
  @ApiResponse({
    status: 200,
    description: 'Database connection is healthy',
  })
  @ApiResponse({
    status: 503,
    description: 'Database connection failed',
  })
  async getDatabaseHealth() {
    return this.healthService.getDatabaseHealth();
  }

  @Get('cache')
  @ApiOperation({
    summary: 'Check cache connectivity',
    description: 'Tests Redis connection and returns connection details'
  })
  @ApiResponse({
    status: 200,
    description: 'Cache connection is healthy',
  })
  @ApiResponse({
    status: 503,
    description: 'Cache connection failed',
  })
  async getCacheHealth() {
    return this.healthService.getCacheHealth();
  }

  @Get('queue')
  @ApiOperation({
    summary: 'Check queue connectivity',
    description: 'Tests RabbitMQ connection and returns connection details'
  })
  @ApiResponse({
    status: 200,
    description: 'Queue connection is healthy',
  })
  @ApiResponse({
    status: 503,
    description: 'Queue connection failed',
  })
  async getQueueHealth() {
    return this.healthService.getQueueHealth();
  }
}
