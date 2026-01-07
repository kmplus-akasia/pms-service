import { Injectable } from '@nestjs/common';
import { MysqlService } from '../../../../infrastructure/database/mysql.service';
import { SuperiorEmployeePositionMasterRepository } from '../repositories/superior-employee-position-master.repository';

interface GetSuperiorByPositionParams {
  position_master_id: number | number[];
  additionalData?: string[];
  additionalJoin?: string[];
}

@Injectable()
export class GetSuperiorByPositionService {
  constructor(private readonly mysqlService: MysqlService) {}

  async execute({
    position_master_id,
    additionalData,
    additionalJoin,
  }: GetSuperiorByPositionParams): Promise<any[]> {
    // Build query filter manually
    const queryFilter = `AND tpm.position_master_id ${Array.isArray(position_master_id) ? `IN (${position_master_id.join(',')})` : `= ${position_master_id}`}`;

    const query = SuperiorEmployeePositionMasterRepository.query({
      queryFilter,
      additionalData,
      additionalJoin,
    });

    const superiors = await this.mysqlService.query(query, {});

    return [superiors];
  }
}
