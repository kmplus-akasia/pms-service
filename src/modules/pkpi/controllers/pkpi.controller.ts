import { Controller, Get, Post, Query, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PkpiService } from '../services/pkpi.service';
import { PkpiIntegrationService } from '../services/pkpi-integration.service';
import { SyncPkpiDto } from '../dto/sync-pkpi.dto';
import { PKpiResponse } from '../services/pkpi.service';
import { PreparedKpiData } from '../services/pkpi-integration.service';

@ApiTags('pkpi')
@Controller('pkpi')
export class PkpiController {
  private readonly logger = new Logger(PkpiController.name);

  constructor(
    private readonly pkpiService: PkpiService,
    private readonly pkpiIntegrationService: PkpiIntegrationService,
  ) {}

  @Get('group')
  @ApiOperation({
    summary: 'Get KPI data by group',
    description: 'Fetch KPI data from external PKPI service for a specific group'
  })
  @ApiQuery({ name: 'groupId', description: 'Group identifier', example: 'GROUP001' })
  @ApiQuery({ name: 'year', description: 'Year for KPI data', example: 2026 })
  @ApiQuery({ name: 'tw', description: 'Time window/period', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'KPI data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'object', description: 'PKPI response data' },
        group_id: { type: 'string', example: 'GROUP001' },
        year: { type: 'number', example: 2026 },
        tw: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - External service unavailable'
  })
  async getKPIByGroup(
    @Query('groupId') groupId: string,
    @Query('year') year: string,
    @Query('tw') tw: string,
  ): Promise<PKpiResponse> {
    try {
      const result = await this.pkpiService.getKPIByGroup(
        [groupId],
        parseInt(year),
        parseInt(tw)
      );
      return result;
    } catch (error) {
      this.logger.error(`Error fetching KPI by group ${groupId}:`, error);
      throw error;
    }
  }

  @Get('regional')
  @ApiOperation({
    summary: 'Get KPI data by regional',
    description: 'Fetch KPI data from external PKPI service for a specific regional entity'
  })
  @ApiQuery({ name: 'regionalId', description: 'Regional identifier', example: 'RH1' })
  @ApiQuery({ name: 'entitas', description: 'Regional entity code', example: 'REG1' })
  @ApiQuery({ name: 'year', description: 'Year for KPI data', example: 2026 })
  @ApiQuery({ name: 'tw', description: 'Time window/period', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'KPI data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'object', description: 'PKPI response data' },
        regional_id: { type: 'string', example: 'RH1' },
        entitas: { type: 'string', example: 'REG1' },
        year: { type: 'number', example: 2026 },
        tw: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - External service unavailable'
  })
  async getKPIByRegional(
    @Query('regionalId') regionalId: string,
    @Query('entitas') entitas: string,
    @Query('year') year: string,
    @Query('tw') tw: string,
  ): Promise<PKpiResponse> {
    try {
      const result = await this.pkpiService.getKPIByRegional(
        [regionalId],
        entitas,
        parseInt(year),
        parseInt(tw)
      );
      return result;
    } catch (error) {
      this.logger.error(`Error fetching KPI by regional ${regionalId}:`, error);
      throw error;
    }
  }

  @Get('subholding')
  @ApiOperation({
    summary: 'Get KPI data by subholding',
    description: 'Fetch KPI data from external PKPI service for a specific subholding entity'
  })
  @ApiQuery({ name: 'subholdingId', description: 'Subholding identifier', example: 'PLJM' })
  @ApiQuery({ name: 'entitas', description: 'Subholding entity code', example: 'SPJM' })
  @ApiQuery({ name: 'year', description: 'Year for KPI data', example: 2026 })
  @ApiQuery({ name: 'tw', description: 'Time window/period', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'KPI data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'object', description: 'PKPI response data' },
        subholding_id: { type: 'string', example: 'PLJM' },
        entitas: { type: 'string', example: 'SPJM' },
        year: { type: 'number', example: 2026 },
        tw: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - External service unavailable'
  })
  async getKPIBySubholding(
    @Query('subholdingId') subholdingId: string,
    @Query('entitas') entitas: string,
    @Query('year') year: string,
    @Query('tw') tw: string,
  ): Promise<PKpiResponse> {
    try {
      const result = await this.pkpiService.getKPIBySubholding(
        [subholdingId],
        entitas,
        parseInt(year),
        parseInt(tw)
      );
      return result;
    } catch (error) {
      this.logger.error(`Error fetching KPI by subholding ${subholdingId}:`, error);
      throw error;
    }
  }

  @Post('prepare-group-head')
  @ApiOperation({
    summary: 'Prepare PKPI data for group heads',
    description: 'Fetch and prepare PKPI data from external service for synchronization to group head KPIs. This prepares data structures but does not write to database.'
  })
  @ApiBody({
    type: SyncPkpiDto,
    description: 'Synchronization parameters',
    examples: {
      'full-sync': {
        summary: 'Full synchronization',
        value: {
          year: 2026,
          periode: '1',
          group_ids: ['GROUP001', 'GROUP002'],
          regional_ids: ['REG1-RH1', 'REG2-RH2'],
          subholding_ids: ['SPJM-PLJM', 'SPMT-PLMT']
        }
      },
      'group-only': {
        summary: 'Group KPIs only',
        value: {
          year: 2026,
          periode: '1',
          group_ids: ['GROUP001']
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'PKPI data prepared successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            preparedKpis: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  kpi: { type: 'object', description: 'KPI entity data' },
                  ownership: { type: 'object', description: 'KPI ownership data' },
                  score: { type: 'object', description: 'KPI score data' }
                }
              }
            },
            groupCodeToGroupId: {
              type: 'object',
              example: { 'GROUP001': 123, 'REG1-RH1': 456 }
            },
            impactedGroupIds: {
              type: 'array',
              items: { type: 'number' },
              example: [123, 456]
            }
          }
        },
        message: { type: 'string', example: 'PKPI data prepared successfully' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid synchronization parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - External service unavailable or data processing failed'
  })
  async preparePkpiToGroupHead(@Body() syncDto: SyncPkpiDto) {
    try {
      this.logger.log('=== PREPARE GROUP HEAD PKPI', {
        year: syncDto.year,
        periode: syncDto.periode,
        group_ids: syncDto.group_ids,
        regional_ids: syncDto.regional_ids,
        subholding_ids: syncDto.subholding_ids,
      });

      console.time('=== PREPARE GROUP HEAD PKPI');

      const result = await this.pkpiIntegrationService.preparePkpiData({
        periode: syncDto.periode,
        year: syncDto.year,
        group_ids: syncDto.group_ids || [],
        regional_ids: syncDto.regional_ids || [],
        subholding_ids: syncDto.subholding_ids || [],
      });

      console.timeEnd('=== PREPARE GROUP HEAD PKPI');

      return {
        success: true,
        data: result,
        message: 'PKPI data prepared successfully',
      };
    } catch (error) {
      this.logger.error('Error preparing PKPI to group head:', error);
      throw error;
    }
  }

  @Post('sync-group-head')
  @ApiOperation({
    summary: 'Synchronize PKPI data to group heads (Prepare + Write)',
    description: 'Fetch PKPI data from external service, prepare it, and write to database (KPI and KPI Ownership tables). This is a complete synchronization process.'
  })
  @ApiBody({
    type: SyncPkpiDto,
    description: 'Synchronization parameters',
    examples: {
      'full-sync': {
        summary: 'Full synchronization',
        value: {
          year: 2026,
          periode: '1',
          group_ids: ['GROUP001', 'GROUP002'],
          regional_ids: ['REG1-RH1', 'REG2-RH2'],
          subholding_ids: ['SPJM-PLJM', 'SPMT-PLMT']
        }
      },
      'group-only': {
        summary: 'Group KPIs only',
        value: {
          year: 2026,
          periode: '1',
          group_ids: ['GROUP001']
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'PKPI data synchronized successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            prepared: {
              type: 'object',
              properties: {
                totalKpis: { type: 'number', example: 150 },
                impactedGroupIds: {
                  type: 'array',
                  items: { type: 'number' },
                  example: [123, 456]
                }
              }
            },
            written: {
              type: 'object',
              properties: {
                successCount: { type: 'number', example: 148 },
                failedCount: { type: 'number', example: 2 },
                createdKpiIds: {
                  type: 'array',
                  items: { type: 'number' },
                  example: [1001, 1002, 1003]
                },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      index: { type: 'number' },
                      error: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        message: { type: 'string', example: 'PKPI data synchronized successfully. 148 KPIs created, 2 failed.' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid synchronization parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - External service unavailable or data processing failed'
  })
  async syncPkpiToGroupHead(@Body() syncDto: SyncPkpiDto) {
    try {
      this.logger.log('=== SYNC GROUP HEAD PKPI (PREPARE + WRITE)', {
        year: syncDto.year,
        periode: syncDto.periode,
        group_ids: syncDto.group_ids,
        regional_ids: syncDto.regional_ids,
        subholding_ids: syncDto.subholding_ids,
      });

      console.time('=== SYNC GROUP HEAD PKPI - TOTAL');

      // Step 1: Prepare PKPI data
      console.time('=== PREPARE PKPI DATA');
      const preparedResult = await this.pkpiIntegrationService.preparePkpiData({
        periode: syncDto.periode,
        year: syncDto.year,
        group_ids: syncDto.group_ids || [],
        regional_ids: syncDto.regional_ids || [],
        subholding_ids: syncDto.subholding_ids || [],
      });
      console.timeEnd('=== PREPARE PKPI DATA');

      // Step 2: Write prepared data to database
      console.time('=== WRITE TO DATABASE');
      const writeResult = await this.pkpiIntegrationService.writePreparedKpisToDatabase(
        preparedResult.preparedKpis
      );
      console.timeEnd('=== WRITE TO DATABASE');

      console.timeEnd('=== SYNC GROUP HEAD PKPI - TOTAL');

      const message = `PKPI data synchronized successfully. ${writeResult.successCount} KPIs created${
        writeResult.failedCount > 0 ? `, ${writeResult.failedCount} failed` : ''
      }.`;

      return {
        success: true,
        data: {
          prepared: {
            totalKpis: preparedResult.preparedKpis.length,
            impactedGroupIds: preparedResult.impactedGroupIds,
          },
          written: {
            successCount: writeResult.successCount,
            failedCount: writeResult.failedCount,
            createdKpiIds: writeResult.createdKpis.map(kpi => kpi.kpiId),
            errors: writeResult.errors,
          },
        },
        message,
      };
    } catch (error) {
      this.logger.error('Error syncing PKPI to group head:', error);
      throw error;
    }
  }
}
