import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MysqlService } from '../../../infrastructure/database/mysql.service';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  uid: string;
  user_id: number;
  employee: { employee_id: number, employee_number: string };
  role_code: string[];
  privileges: string[];
  random: string;
  exp: number;
  iat: number;
}

export interface UserContext {
  userId: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  positions: {
    positionMasterId: number | null;
    positionName: string;
    isJobAssignment: boolean;
    lakharId: number | null;
    jobSharingId: number | null;
    groupMasterId: number | null;
    groupName: string;
    companyInId: number | null;
    companyName: string;
    positionStartDate: Date | null;
    positionEndDate: Date | null;
  }[];
  activePosition: {
    positionMasterId: number | null;
    positionName: string;
    isJobAssignment: boolean;
    lakharId: number | null;
    jobSharingId: number | null;
    groupMasterId: number | null;
    groupName: string;
    companyInId: number | null;
    companyName: string;
    positionStartDate: Date | null;
    positionEndDate: Date | null;
  };
  groups: {
    groupMasterId: number | null;
    groupName: string;
  }[];
  activeGroup: {
    groupMasterId: number | null;
    groupName: string;
  };
  companies: {
    companyInId: number | null;
    companyName: string;
  }[];
  activeCompany: {
    companyInId: number | null;
    companyName: string;
  };
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          // Extract token from 'smartkmsystemAuth' cookie
          const cookies = request.cookies || {};
          const authCookie = cookies['smartkmsystemAuth'];

          if (!authCookie || !authCookie.startsWith('Bearer ')) {
            return null;
          }

          return authCookie.substring(7); // Remove 'Bearer ' prefix
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<UserContext> {
    const { employee } = payload;
    const { employee_number: employeeNumber } = employee;

    if (!employeeNumber) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Check Redis cache first
    const cacheKey = `user:${employeeNumber}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) {
      try {
        const userData = JSON.parse(cachedUser);
        // Validate that cached data has required fields
        if (userData.employeeNumber && userData.employeeName) {
          return userData;
        }
      } catch (error) {
        // Invalid cached data, continue to database lookup
      }
    }

    // Fallback to database lookup
    const user = await this.lookupUserInDatabase(employeeNumber);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Cache user data for 1 hour
    await this.redisService.set(cacheKey, JSON.stringify(user), 3600);

    return user;
  }

  private async lookupUserInDatabase(employeeNumber: string): Promise<UserContext | null> {
    try {
      // Query user data from database
      // Note: This assumes a tb_employee table exists with the specified structure
      // In a real implementation, you might need to adjust based on your actual schema

      const query = `
        SELECT
          tu.user_id,
          te.employee_id,
          te.employee_number,
          te.firstname as employee_name,
          tepms.lakhar_id,
          tepms.job_sharing_id,
          tpmv2.position_master_id,
          tpmv2.name as position_name,
          tepms.start_date as position_start_date,
          tepms.end_date as position_end_date,
          CASE
            WHEN COALESCE(tpmv2.is_job_assignment, 0) = 1
              OR COALESCE(tpmv.is_job_assignment, 0) = 1
            THEN 1
            ELSE 0
          END AS is_job_assignment,
          tgm.group_master_id,
          tgm.name as group_name,
          tci.company_in_id,
          tci.name as company_name
        FROM tb_employee te
        LEFT JOIN tb_user tu
          ON tu.user_id = te.user_id
          AND tu.deletedAt IS NULL
        LEFT JOIN tb_employee_position_master_sync tepms 
          ON tepms.employee_number = te.employee_number 
          AND NOW() BETWEEN tepms.start_date AND tepms.end_date
          AND tepms.deletedAt IS NULL
        LEFT JOIN tb_position_master_variant tpmv
          ON tpmv.position_master_variant_id = tepms.position_master_variant_id
          AND tepms.deletedAt IS NULL
        LEFT JOIN tb_position_master_v2 tpmv2
          ON tpmv2.position_master_id = tpmv.position_master_id 
          AND NOW() BETWEEN tpmv2.start_date AND tpmv2.end_date 
          AND tpmv2.deletedAt IS NULL
        LEFT JOIN tb_position_master_type tpmt
          ON tpmt.position_master_type_id = tpmv2.position_master_type_id 
          AND tpmt.deletedAt IS NULL
        LEFT JOIN tb_position_master_organization_sync tpmos
          ON tpmos.position_master_id = tpmv2.position_master_id 
          AND NOW() BETWEEN tpmos.start_date AND tpmos.end_date 
          AND tpmos.deletedAt IS NULL
        LEFT JOIN tb_group_master tgm
          ON tgm.group_master_id = tpmos.organization_master_id 
          AND NOW() BETWEEN tgm.start_date AND tgm.end_date 
          AND tgm.deletedAt IS NULL
        LEFT JOIN tb_company_in tci
          ON tci.company_in_id = tgm.company_id 
          AND (NOW() BETWEEN tci.start_date AND tci.end_date OR (NOW() > tci.start_date AND tci.end_date IS NULL)) 
          AND tci.deletedAt IS NULL
        WHERE te.employee_number = ?
          AND te.deletedAt IS NULL
          AND te.archived_at IS NULL
      `;

      const users = await this.mysqlService.query(query, [employeeNumber]);

      if (users.length === 0) {
        return null;
      }

      // Aggregate the results into the structure needed for UserContext
      const userData = {
        employee_number: users[0].employee_number,
        user_id: users[0].user_id,
        employee_id: users[0].employee_id,
        employee_name: users[0].employee_name,
      };

      // positions: all entries, removing null positions
      const positions = users
        .filter(row => row.position_master_id)
        .map(row => ({
          positionMasterId: row.position_master_id || null,
          positionName: row.position_name || '',
          isJobAssignment: !!row.is_job_assignment,
          lakharId: row.lakhar_id || null,
          jobSharingId: row.job_sharing_id || null,
          groupMasterId: row.group_master_id || null,
          groupName: row.group_name || '',
          companyInId: row.company_in_id?.toString() || '',
          companyName: row.company_name || '',
          positionStartDate: row.position_start_date || '',
          positionEndDate: row.position_end_date || '',
        }));
      
      const activePosition = positions.find(position => !position.isJobAssignment && !position.jobSharingId && !position.lakharId);

      // groups: unique by group_master_id
      const groupsMap = new Map<number | null, { groupMasterId: number | null, groupName: string }>();
      users.forEach(row => {
        if (row.group_master_id) {
          groupsMap.set(row.group_master_id, {
            groupMasterId: row.group_master_id,
            groupName: row.group_name || '',
          });
        }
      });
      const groups = Array.from(groupsMap.values());
      const activeGroup = groups.find(group => group.groupMasterId === activePosition?.groupMasterId);

      // companies: unique by company_in_id
      const companiesMap = new Map<number | null, { companyInId: number | null, companyName: string }>();
      users.forEach(row => {
        if (row.company_in_id) {
          companiesMap.set(row.company_in_id, {
            companyInId: row.company_in_id,
            companyName: row.company_name || '',
          });
        }
      });
      const companies = Array.from(companiesMap.values());
      const activeCompany = companies.find(company => company.companyInId === activePosition?.companyInId);


      // Map to UserContext interface
      const user: UserContext = {
        employeeNumber: userData.employee_number,
        userId: userData.user_id,
        employeeId: userData.employee_id,
        employeeName: userData.employee_name || 'Unknown User',
        positions: positions,
        activePosition: {
          positionMasterId: activePosition?.positionMasterId || '',
          positionName: activePosition?.positionName || '',
          isJobAssignment: activePosition?.isJobAssignment || false,
          lakharId: activePosition?.lakharId || '',
          jobSharingId: activePosition?.jobSharingId || '',
          groupMasterId: activePosition?.groupMasterId || '',
          groupName: activePosition?.groupName || '',
          companyInId: activePosition?.companyInId || '',
          companyName: activePosition?.companyName || '',
          positionStartDate: activePosition?.positionStartDate || '',
          positionEndDate: activePosition?.positionEndDate || '',
        },
        groups: groups,
        activeGroup: activeGroup || { groupMasterId: null, groupName: '' },
        companies: companies,
        activeCompany: activeCompany || { companyInId: null, companyName: '' },
      };

      return user;
    } catch (error) {
      console.error('Error looking up user in database:', error);
      return null;
    }
  }

  private getDefaultPermissions(userData: any): string[] {
    // TODO: Implement proper permission system based on role/department
    // For now, return basic permissions for all users
    const basePermissions = [
      'kpi.view',
      'kpi.create',
      'performance.view',
    ];

    // Add management permissions based on position (if applicable)
    if (userData.position_master_variant_id) {
      basePermissions.push(
        'kpi.approve',
        'team.view',
        'performance.manage'
      );
    }

    return basePermissions;
  }
}
