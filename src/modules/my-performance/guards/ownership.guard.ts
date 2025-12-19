import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { KpiEntity, KpiOwnershipEntity, OwnershipType } from '../../../infrastructure/database/entities';

export interface OwnershipRequirement {
  requireOwner?: boolean;
  requireCanEdit?: boolean;
  requireCanInputRealization?: boolean;
  allowSharedOwner?: boolean;
  allowCollaborator?: boolean;
}

export const OWNERSHIP_REQUIREMENT_KEY = 'ownership_requirement';

@Injectable()
export class OwnershipGuard implements CanActivate {
  private logger = new Logger(OwnershipGuard.name);

  constructor(
    @Inject('KpiRepository')
    private readonly kpiRepository: Repository<KpiEntity>,
    @Inject('KpiOwnershipRepository')
    private readonly ownershipRepository: Repository<KpiOwnershipEntity>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.employeeNumber) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get KPI ID from request
    const kpiId = this.extractKpiId(request, context);
    if (!kpiId) {
      // If no KPI ID in request, allow access (for endpoints that don't require ownership)
      return true;
    }

    // Get ownership requirements from decorator
    const requirements = this.reflector.get<OwnershipRequirement>(
      OWNERSHIP_REQUIREMENT_KEY,
      context.getHandler(),
    ) || {};

    // Check ownership
    const ownership = await this.ownershipRepository.findOne({
      where: {
        kpiId: kpiId,
        employeeNumber: user.employeeNumber,
      },
      relations: ['kpi'],
    });

    if (!ownership) {
      this.logger.warn(
        `Access denied: User ${user.employeeNumber} has no ownership of KPI ${kpiId}`
      );
      throw new ForbiddenException('You do not have access to this KPI');
    }

    // Check ownership type requirements
    const ownershipType = ownership.ownershipType;

    // If requireOwner is true, must be OWNER
    if (requirements.requireOwner && ownershipType !== OwnershipType.OWNER) {
      throw new ForbiddenException('Only KPI owners can perform this action');
    }

    // If requireCanEdit is true, check edit permissions
    if (requirements.requireCanEdit) {
      const canEdit = this.canEditKpi(ownership);
      if (!canEdit) {
        throw new ForbiddenException('You cannot edit this KPI');
      }
    }

    // If requireCanInputRealization is true, check realization input permissions
    if (requirements.requireCanInputRealization) {
      const canInputRealization = this.canInputRealization(ownership);
      if (!canInputRealization) {
        throw new ForbiddenException('You cannot input realization for this KPI');
      }
    }

    // Check allowed ownership types
    if (!requirements.allowSharedOwner && ownershipType === OwnershipType.SHARED_OWNER) {
      throw new ForbiddenException('Shared owners are not allowed for this action');
    }

    if (!requirements.allowCollaborator && ownershipType === OwnershipType.COLLABORATOR) {
      throw new ForbiddenException('Collaborators are not allowed for this action');
    }

    // Attach ownership info to request for use in service methods
    request.ownership = ownership;
    request.canEdit = this.canEditKpi(ownership);
    request.canInputRealization = this.canInputRealization(ownership);

    return true;
  }

  private extractKpiId(request: any, context: ExecutionContext): number | null {
    // Try different sources for KPI ID
    const { params, body, query } = request;

    // From route params
    if (params.kpiId) {
      return parseInt(params.kpiId, 10);
    }

    // From request body
    if (body.kpiId) {
      return parseInt(body.kpiId, 10);
    }

    // From query params
    if (query.kpiId) {
      return parseInt(query.kpiId, 10);
    }

    return null;
  }

  private canEditKpi(ownership: KpiOwnershipEntity): boolean {
    // Only owners can edit, and only in draft status
    return (
      ownership.ownershipType === OwnershipType.OWNER &&
      ownership.kpi.itemApprovalStatus === 'DRAFT'
    );
  }

  private canInputRealization(ownership: KpiOwnershipEntity): boolean {
    // Only owners can input realization (shared owners cannot)
    return ownership.ownershipType === OwnershipType.OWNER;
  }
}

// Decorator to set ownership requirements
export function RequireOwnership(requirements: OwnershipRequirement) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(OWNERSHIP_REQUIREMENT_KEY, requirements, descriptor.value);
    return descriptor;
  };
}

// Predefined decorators for common use cases
export function RequireOwner() {
  return RequireOwnership({ requireOwner: true });
}

export function RequireCanEdit() {
  return RequireOwnership({ requireCanEdit: true });
}

export function RequireCanInputRealization() {
  return RequireOwnership({ requireCanInputRealization: true });
}

export function AllowSharedOwner() {
  return RequireOwnership({
    allowSharedOwner: true,
    requireCanEdit: false,
    requireCanInputRealization: false,
  });
}
