import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { KpiEntity } from './kpi.entity';

export enum OwnershipType {
  OWNER = 'OWNER',
  SHARED_OWNER = 'SHARED_OWNER',
  COLLABORATOR = 'COLLABORATOR',
}

export enum WeightApprovalStatus {
  DRAFT = 'DRAFT',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  REJECTED = 'REJECTED',
  READY = 'READY',
  APPROVED = 'APPROVED',
}

@Entity('kpi_ownership_v3')
@Index(['ownershipType'])
@Index(['employeeNumber', 'year'])
@Index(['positionMasterVariantId'])
@Index(['weightApprovalStatus', 'weightApproverEmployeeNumber'])
@Index(['year', 'startDate', 'endDate'])
export class KpiOwnershipEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_ownership_id' })
  kpiOwnershipId: number;

  @Column({ type: 'bigint', nullable: false, name: 'kpi_id' })
  kpiId: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'employee_number' })
  employeeNumber: string;

  @Column({ type: 'bigint', nullable: true, name: 'position_master_variant_id' })
  positionMasterVariantId: number;

  @Column({
    type: 'enum',
    enum: OwnershipType,
    nullable: false,
    name: 'ownership_type',
  })
  ownershipType: OwnershipType;

  @Column({ type: 'float', nullable: true, name: 'weight' })
  weight: number;

  @Column({
    type: 'enum',
    enum: WeightApprovalStatus,
    nullable: true,
    name: 'weight_approval_status',
  })
  weightApprovalStatus: WeightApprovalStatus;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'weight_approver_employee_number' })
  weightApproverEmployeeNumber: string;

  @Column({ type: 'text', nullable: true, name: 'weight_approver_text' })
  weightApproverText: string;

  @Column({ type: 'text', nullable: true, name: 'weight_approval_notes' })
  weightApprovalNotes: string;

  @Column({ type: 'float', nullable: true, name: 'last_realization' })
  lastRealization: number;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'int', nullable: true, name: 'year' })
  year: number;

  @Column({ type: 'int', name: 'version' })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  // Relationships
  @ManyToOne(() => KpiEntity)
  @JoinColumn({ name: 'kpi_id' })
  kpi: KpiEntity;

  // Employee relationships would be added when Employee entity is created
  // @ManyToOne(() => EmployeeEntity)
  // @JoinColumn({ name: 'employee_number' })
  // employee: EmployeeEntity;

  // @ManyToOne(() => EmployeeEntity)
  // @JoinColumn({ name: 'weight_approver_employee_number' })
  // weightApprover: EmployeeEntity;

  // Position relationship would be added when Position entity is created
  // @ManyToOne(() => PositionMasterVariantEntity)
  // @JoinColumn({ name: 'position_master_variant_id' })
  // position: PositionMasterVariantEntity;
}
