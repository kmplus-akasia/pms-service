import { Injectable } from '@nestjs/common';
import { MysqlService } from '../../../../infrastructure/database/mysql.service';
import { SubordinateEmployeePositionMasterRepository } from '../repositories/subordinate-employee-position-master.repository';

interface GetSubordinateByPositionParams {
  position_master_id: number | number[];
  search?: string;
  additionalData?: string[];
}

@Injectable()
export class GetSubordinateByPositionService {
  constructor(private readonly mysqlService: MysqlService) {}

  async execute({ position_master_id, search, additionalData }: GetSubordinateByPositionParams): Promise<any[]> {
    // Build query filter manually
    const queryFilter = `AND tpmv.position_master_id ${Array.isArray(position_master_id) ? `IN (${position_master_id.join(',')})` : `= ${position_master_id}`}`;

    const options = {
      additionalData,
      search: search ? `%${search}%` : null,
    };

    const query = SubordinateEmployeePositionMasterRepository.query({
      queryFilter,
      ...options,
    });

    const subordinates = await this.mysqlService.query(query, options);

    return [subordinates];
  }
}
