import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

// Services
import { MyPerformanceService } from '../services/my-performance.service';

// DTOs
import { CreateKpiDto } from '../dto/create-kpi.dto';
import { SubmitRealizationDto } from '../dto/submit-realization.dto';
import { KpiResponseDto } from '../dto/kpi-response.dto';
import { DashboardResponseDto } from '../dto/dashboard.response.dto';

// Guards
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';

@ApiTags('my-performance')
@ApiCookieAuth('smartkmsystemAuth')
@Controller('my-performance')
@UseGuards(JwtAuthGuard)
export class MyPerformanceController {
  constructor(private readonly myPerformanceService: MyPerformanceService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get personal performance dashboard',
    description: 'Retrieve current user\'s KPI overview, scores, progress indicators, and upcoming calendar events'
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: DashboardResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDashboard(@Req() req: any): Promise<DashboardResponseDto> {
    return this.myPerformanceService.getDashboard(req.user);
  }

  @Post('kpi')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new KPI draft',
    description: 'Create a new KPI (Output or KAI) in draft status for the authenticated user'
  })
  @ApiBody({
    type: CreateKpiDto,
    description: 'KPI creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'KPI draft created successfully',
    type: KpiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createKpi(
    @Body() dto: CreateKpiDto,
    @Req() req: any,
  ): Promise<KpiResponseDto> {
    return this.myPerformanceService.createKpiDraft(dto, req.user);
  }

  @Post('kpi/from-dictionary')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create KPI from dictionary',
    description: 'Create a new KPI using a standardized template from the KPI dictionary'
  })
  @ApiBody({
    type: CreateKpiDto,
    description: 'KPI creation data with dictionary reference',
  })
  @ApiResponse({
    status: 201,
    description: 'KPI from dictionary created successfully',
    type: KpiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed - Invalid dictionary reference or input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Dictionary item not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async createKpiFromDictionary(
    @Body() dto: CreateKpiDto,
    @Req() req: any,
  ): Promise<KpiResponseDto> {
    // Mark as from dictionary
    dto.fromDictionary = true;
    return this.myPerformanceService.createKpiDraft(dto, req.user);
  }

  @Put('kpi/:kpiId/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit KPI for approval',
    description: 'Submit a drafted KPI for approval by the user\'s supervisor'
  })
  @ApiParam({
    name: 'kpiId',
    description: 'KPI ID to submit for approval',
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: 'KPI submitted for approval successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed - KPI not ready for submission',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the owner or insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'KPI not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async submitKpiForApproval(
    @Param('kpiId') kpiId: number,
    @Req() req: any,
  ): Promise<void> {
    await this.myPerformanceService.submitKpiForApproval(kpiId, req.user);
  }

  @Get('kpi/:kpiId')
  @ApiOperation({
    summary: 'Get KPI details',
    description: 'Get detailed information about a specific KPI including progress, ownership, and status'
  })
  @ApiParam({
    name: 'kpiId',
    description: 'KPI ID to retrieve',
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: 'KPI details retrieved successfully',
    type: KpiResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No access to this KPI',
  })
  @ApiResponse({
    status: 404,
    description: 'KPI not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async getKpiDetails(
    @Param('kpiId') kpiId: number,
    @Req() req: any,
  ): Promise<KpiResponseDto> {
    // TODO: Implement get KPI details method
    // For now, return a placeholder
    return {} as KpiResponseDto;
  }

  @Post('realization')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit KPI realization',
    description: 'Submit actual performance data for a KPI with evidence and notes'
  })
  @ApiBody({
    type: SubmitRealizationDto,
    description: 'Realization submission data with evidence',
  })
  @ApiResponse({
    status: 201,
    description: 'Realization submitted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed - Invalid input data or evidence',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to submit realization for this KPI',
  })
  @ApiResponse({
    status: 404,
    description: 'KPI not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async submitRealization(
    @Body() dto: SubmitRealizationDto,
    @Req() req: any,
  ): Promise<void> {
    await this.myPerformanceService.submitRealization(dto, req.user);
  }

  @Get('realization/pending')
  @ApiOperation({
    summary: 'Get pending realization inputs',
    description: 'Get list of KPIs that require realization input for the current period'
  })
  @ApiResponse({
    status: 200,
    description: 'Pending realization inputs retrieved successfully',
    schema: {
      type: 'array',
      items: { $ref: '#/components/schemas/KpiResponseDto' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async getPendingRealizations(@Req() req: any): Promise<KpiResponseDto[]> {
    // TODO: Implement get pending realizations method
    return [];
  }

  @Get('calendar')
  @ApiOperation({
    summary: 'Get performance calendar',
    description: 'Get calendar events including deadlines, planning periods, and important dates'
  })
  @ApiResponse({
    status: 200,
    description: 'Calendar events retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'event_123' },
              title: { type: 'string', example: 'Input KPI Realization - Jan 2026' },
              date: { type: 'string', example: '2026-01-05' },
              type: { type: 'string', enum: ['PLANNING_START', 'INPUT_DEADLINE', 'APPROVAL_DEADLINE', 'P_KPI_SYNC'] },
              priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
              description: { type: 'string' },
              actionUrl: { type: 'string' },
              isOverdue: { type: 'boolean' },
              daysUntil: { type: 'number' },
            },
          },
        },
        period: { type: 'string', example: '2026-01' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async getCalendar(@Req() req: any): Promise<any> {
    // TODO: Implement calendar retrieval
    return {
      events: [],
      period: '2026-01',
    };
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get performance statistics',
    description: 'Get detailed performance statistics and trends for the user'
  })
  @ApiResponse({
    status: 200,
    description: 'Performance statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        period: { type: 'string', example: '2026-01' },
        totalKpis: { type: 'number', example: 12 },
        completedRealizations: { type: 'number', example: 10 },
        averageAchievement: { type: 'number', example: 85.5 },
        trendDirection: { type: 'string', enum: ['UP', 'DOWN', 'STABLE'], example: 'UP' },
        topPerformingKpis: {
          type: 'array',
          items: { $ref: '#/components/schemas/KpiResponseDto' },
        },
        underPerformingKpis: {
          type: 'array',
          items: { $ref: '#/components/schemas/KpiResponseDto' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async getStatistics(@Req() req: any): Promise<any> {
    // TODO: Implement statistics calculation
    return {
      period: '2026-01',
      totalKpis: 12,
      completedRealizations: 10,
      averageAchievement: 85.5,
      trendDirection: 'UP',
      topPerformingKpis: [],
      underPerformingKpis: [],
    };
  }

  @Get('alerts')
  @ApiOperation({
    summary: 'Get performance alerts',
    description: 'Get active alerts for KPIs that need attention (behind schedule, at risk, etc.)'
  })
  @ApiResponse({
    status: 200,
    description: 'Performance alerts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'alert_123' },
          type: { type: 'string', enum: ['BEHIND_SCHEDULE', 'AT_RISK', 'OVERDUE', 'APPROVAL_PENDING'], example: 'AT_RISK' },
          severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], example: 'HIGH' },
          title: { type: 'string', example: 'KPI "Container Throughput" is behind target' },
          description: { type: 'string', example: 'Current achievement is 75% vs target 90%' },
          kpiId: { type: 'number', example: 123 },
          actionUrl: { type: 'string', example: '/my-performance/kpi/123' },
          createdAt: { type: 'string', example: '2026-01-15T10:30:00Z' },
          isRead: { type: 'boolean', example: false },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async getAlerts(@Req() req: any): Promise<any[]> {
    // TODO: Implement alerts retrieval
    return [];
  }

  @Get('kpi')
  @ApiOperation({
    summary: 'Get user KPIs list',
    description: 'Get paginated list of user\'s KPIs with filtering options'
  })
  @ApiResponse({
    status: 200,
    description: 'KPI list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/KpiResponseDto' },
        },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        hasMore: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async getUserKpis(@Req() req: any): Promise<any> {
    // TODO: Implement KPI list retrieval with pagination
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      hasMore: false,
    };
  }
}
