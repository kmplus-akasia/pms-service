import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MysqlService } from '../../../infrastructure/database/mysql.service';
import { RedisService } from '../../../infrastructure/cache/redis.service';

export interface JwtPayload {
  sub: string; // employee_number
  employeeNumber: string;
  iat?: number;
  exp?: number;
}

export interface UserContext {
  employeeNumber: string;
  employeeName: string;
  positionId: string;
  departmentId: string;
  permissions: string[];
  sessionId: string;
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
    const { sub: employeeNumber } = payload;

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
          e.employee_number,
          e.employee_name,
          COALESCE(e.position_id, '') as position_id,
          COALESCE(e.department_id, '') as department_id,
          COALESCE(p.position_master_variant_id, '') as position_master_variant_id
        FROM tb_employee e
        LEFT JOIN tb_position_master_variant p ON e.position_id = p.position_id
        WHERE e.employee_number = ?
          AND e.is_active = 1
      `;

      const users = await this.mysqlService.query(query, [employeeNumber]);

      if (users.length === 0) {
        return null;
      }

      const userData = users[0];

      // Map to UserContext interface
      const user: UserContext = {
        employeeNumber: userData.employee_number,
        employeeName: userData.employee_name || 'Unknown User',
        positionId: userData.position_master_variant_id || '',
        departmentId: userData.department_id || '',
        permissions: this.getDefaultPermissions(userData), // TODO: Implement proper permission system
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
