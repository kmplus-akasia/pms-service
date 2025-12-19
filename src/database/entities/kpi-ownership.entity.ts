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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiOwnershipId: number;

  @Column({ type: 'bigint', nullable: false })
  kpiId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  employeeNumber: string;

  @Column({ type: 'bigint', nullable: true })
  positionMasterVariantId: number;

  @Column({
    type: 'enum',
    enum: OwnershipType,
    nullable: false,
  })
  ownershipType: OwnershipType;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({
    type: 'enum',
    enum: WeightApprovalStatus,
    nullable: true,
  })
  weightApprovalStatus: WeightApprovalStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weightApproverEmployeeNumber: string;

  @Column({ type: 'text', nullable: true })
  weightApproverText: string;

  @Column({ type: 'text', nullable: true })
  weightApprovalNotes: string;

  @Column({ type: 'float', nullable: true })
  lastRealization: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'int' })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
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
