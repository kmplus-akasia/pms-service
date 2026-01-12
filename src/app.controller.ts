import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello World!'
  }

  @Get('ping')
  @ApiOperation({
    summary: 'Ping endpoint',
    description: 'Simple ping endpoint for quick health checks'
  })
  @ApiResponse({
    status: 200,
    description: 'Service is responsive',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'pong' }
      }
    }
  })
  ping() {
    return { message: 'pong' };
  }

  @Get('playground')
  @ApiOperation({ 
    summary: 'Playground endpoint',
    description: 'Playground endpoint for pretty much anything you want to test'
  })
  @ApiResponse({
    status: 200,
    description: 'Playground endpoint',
  })
  async playground() {
    if (process.env.NODE_ENV === 'production') {
      return { message: 'This endpoint is only available in development mode' };
    }
    
    const result = await this.appService.playground();
    return { result };
  }
}
