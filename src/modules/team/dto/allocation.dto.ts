import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsArray, ValidateNested, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Allocation Strategy Enum
 */
export enum AllocationStrategy {
  SHARED_OWNER = 'SHARED_OWNER', // 1 Owner + N Shared Owners
  DUPLICATE_KPI = 'DUPLICATE_KPI', // Each incumbent gets their own KPI instance
}

/**
 * Incumbent Configuration for Allocation
 */
export class IncumbentAllocationDto {
  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @ApiProperty({ example: true, description: 'Is this incumbent the Owner?' })
  isOwner: boolean;

  @ApiProperty({ example: 100, description: 'Target value for this incumbent' })
  @IsNumber()
  @IsNotEmpty()
  targetValue: number;

  @ApiProperty({ example: 20, description: 'Weight percentage in portfolio' })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: 50, required: false, description: 'Contribution percentage (for Shared Owner)' })
  @IsNumber()
  @IsOptional()
  contributionPercentage?: number;
}

/**
 * Allocate KPI from Performance Tree DTO
 * US-MT-023: Allocate KPI from Performance Tree to Team Members
 */
export class AllocateKpiFromTreeDto {
  @ApiProperty({ example: 1, description: 'Performance Tree item ID' })
  @IsNumber()
  @IsNotEmpty()
  performanceTreeItemId: number;

  @ApiProperty({ enum: AllocationStrategy, example: AllocationStrategy.SHARED_OWNER })
  @IsEnum(AllocationStrategy)
  @IsNotEmpty()
  allocationStrategy: AllocationStrategy;

  @ApiProperty({ type: [IncumbentAllocationDto], description: 'List of incumbents with their configurations' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncumbentAllocationDto)
  incumbents: IncumbentAllocationDto[];

  @ApiProperty({ example: 'Allocating Q1 revenue target to team members', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

/**
 * Unallocated KPI Item from Performance Tree
 * US-MT-022: View Unallocated KPI from Performance Tree
 */
export class UnallocatedKpiItemDto {
  @ApiProperty({ example: 1 })
  performanceTreeItemId: number;

  @ApiProperty({ example: 'Revenue Growth Q1' })
  title: string;

  @ApiProperty({ example: 'OUTPUT', enum: ['OUTPUT', 'KAI'] })
  type: string;

  @ApiProperty({ example: 'Officer Kinerja Individu' })
  masterPositionName: string;

  @ApiProperty({ example: 100, description: 'Template target value' })
  targetValue: number;

  @ApiProperty({ example: 'Million IDR' })
  targetUnit: string;

  @ApiProperty({ example: 'Financial' })
  bscPerspective: string;

  @ApiProperty({ example: 2, description: 'Number of incumbents in this position' })
  incumbentCount: number;

  @ApiProperty({ example: ['12345', '67890'], description: 'Employee numbers of incumbents' })
  incumbentEmployeeNumbers: string[];

  @ApiProperty({ example: 'NEEDS_ALLOCATION' })
  allocationStatus: string;

  @ApiProperty({ example: '2026-01-10T08:00:00Z', description: 'When this item was created in Performance Tree' })
  createdDate: Date;
}

/**
 * Unallocated KPI List Response
 */
export class UnallocatedKpiListResponseDto {
  @ApiProperty({ type: [UnallocatedKpiItemDto] })
  items: UnallocatedKpiItemDto[];

  @ApiProperty({ example: 5, description: 'Total unallocated items' })
  totalCount: number;

  @ApiProperty({ example: 3, description: 'Items for KPI Output' })
  outputCount: number;

  @ApiProperty({ example: 2, description: 'Items for KAI' })
  kaiCount: number;
}

/**
 * Assign Owner DTO
 * US-MT-014: Assign Owner untuk KPI
 */
export class AssignOwnerDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  kpiId: number;

  @ApiProperty({ example: '12345', description: 'Employee number of the Owner' })
  @IsString()
  @IsNotEmpty()
  ownerEmployeeNumber: string;
}

/**
 * Assign Shared Owner DTO
 * US-MT-015: Assign Shared Owner untuk KPI (Vertical Support)
 */
export class AssignSharedOwnerDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  kpiId: number;

  @ApiProperty({ example: ['12345', '67890'], description: 'Employee numbers of Shared Owners' })
  @IsArray()
  @IsNotEmpty()
  sharedOwnerEmployeeNumbers: string[];

  @ApiProperty({ example: [50, 30, 20], description: 'Contribution percentages (must sum to 100)' })
  @IsArray()
  @IsNotEmpty()
  contributionPercentages: number[];
}

/**
 * Same Position Allocation Decision DTO
 * US-MT-016: Handle Same Position Allocation
 */
export class SamePositionAllocationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  performanceTreeItemId: number;

  @ApiProperty({ example: 'Position-123' })
  @IsString()
  @IsNotEmpty()
  positionId: string;

  @ApiProperty({ example: ['12345', '67890', '11111'], description: 'All incumbents in same position' })
  @IsArray()
  @IsNotEmpty()
  incumbentEmployeeNumbers: string[];

  @ApiProperty({ enum: AllocationStrategy })
  @IsEnum(AllocationStrategy)
  @IsNotEmpty()
  strategy: AllocationStrategy;

  @ApiProperty({ example: 'Team revenue is shared responsibility', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  rationale?: string;
}

