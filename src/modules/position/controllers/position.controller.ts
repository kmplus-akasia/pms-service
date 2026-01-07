import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetSuperiorByPositionService } from '../../core/position/services/get-superior-by-position.service';
import { GetSubordinateByPositionService } from '../../core/position/services/get-subordinate-by-position.service';

@ApiTags('position')
@Controller('position')
export class PositionController {
  private readonly logger = new Logger(PositionController.name);

  constructor(
    private readonly getSuperiorByPositionService: GetSuperiorByPositionService,
    private readonly getSubordinateByPositionService: GetSubordinateByPositionService,
  ) {}

  @Get('superior')
  @ApiOperation({
    summary: 'Get superior employees for a position',
    description: 'Retrieve employees who are superiors to the specified position(s)'
  })
  @ApiQuery({
    name: 'position_master_id',
    description: 'Position master ID(s) to find superiors for',
    example: '123'
  })
  @ApiResponse({
    status: 200,
    description: 'Superior employees retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          employee_number: { type: 'string', example: 'EMP001' },
          superior_position_master_id: { type: 'number', example: 123 },
          superior_position_master_variant_id: { type: 'number', example: 456 }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async getSuperiors(
    @Query('position_master_id') positionMasterId: string,
  ) {
    try {
      const positionIds = positionMasterId.includes(',')
        ? positionMasterId.split(',').map(id => parseInt(id.trim()))
        : [parseInt(positionMasterId)];

      const [superiors] = await this.getSuperiorByPositionService.execute({
        position_master_id: positionIds,
        additionalData: [],
      });

      return {
        success: true,
        data: superiors,
        message: 'Superiors retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Error getting superiors:', error);
      throw error;
    }
  }

  @Get('subordinate')
  @ApiOperation({
    summary: 'Get subordinate employees for a position',
    description: 'Retrieve employees who are subordinates to the specified position(s)'
  })
  @ApiQuery({
    name: 'position_master_id',
    description: 'Position master ID(s) to find subordinates for',
    example: '123'
  })
  @ApiResponse({
    status: 200,
    description: 'Subordinate employees retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position_master_id: { type: 'number', example: 123 },
          position_master_variant_id: { type: 'number', example: 456 },
          employee_number: { type: 'string', example: 'EMP001' },
          name: { type: 'string', example: 'John Doe' }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid parameters'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  async getSubordinates(
    @Query('position_master_id') positionMasterId: string,
  ) {
    try {
      const positionIds = positionMasterId.includes(',')
        ? positionMasterId.split(',').map(id => parseInt(id.trim()))
        : [parseInt(positionMasterId)];

      const [subordinates] = await this.getSubordinateByPositionService.execute({
        position_master_id: positionIds,
        search: undefined,
        additionalData: [],
      });

      return {
        success: true,
        data: subordinates,
        message: 'Subordinates retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Error getting subordinates:', error);
      throw error;
    }
  }
}
