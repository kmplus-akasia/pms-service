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
import {
  KpiType,
  NatureOfWork,
  CascadingMethod,
  Polarity,
  MonitoringPeriod,
  KpiOwnershipType,
  Source,
  ItemApprovalStatus,
} from './kpi.entity';

@Entity('kpi_log_v3')
@Index(['kpiId'])
@Index(['createdAt', 'kpiId'])
export class KpiLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_log_id' })
  kpiLogId: number;

  @Column({ type: 'bigint', nullable: false, name: 'kpi_id' })
  kpiId: number;

  @Column({ type: 'text', nullable: true, name: 'log_notes' })
  logNotes: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'parent_kpi_id' })
  parentKpiId: number;

  @Column({
    type: 'enum',
    enum: KpiType,
    nullable: false,
    name: 'type',
  })
  type: KpiType;

  @Column({
    type: 'enum',
    enum: NatureOfWork,
    nullable: true,
    name: 'nature_of_work',
  })
  natureOfWork: NatureOfWork;

  @Column({
    type: 'enum',
    enum: CascadingMethod,
    nullable: true,
    name: 'cascading_method',
  })
  cascadingMethod: CascadingMethod;

  @Column({ type: 'text', nullable: true, name: 'formula' })
  formula: string;

  @Column({ type: 'float', nullable: true, name: 'target' })
  target: number;

  @Column({ type: 'varchar', length: 25, nullable: true, name: 'target_unit' })
  targetUnit: string;

  @Column({ type: 'varchar', length: 25, nullable: true, name: 'perspective' })
  perspective: string;

  @Column({
    type: 'enum',
    enum: Polarity,
    nullable: true,
    name: 'polarity',
  })
  polarity: Polarity;

  @Column({
    type: 'enum',
    enum: MonitoringPeriod,
    nullable: false,
    name: 'monitoring_period',
  })
  monitoringPeriod: MonitoringPeriod;

  @Column({
    type: 'enum',
    enum: KpiOwnershipType,
    nullable: true,
    name: 'kpi_ownership_type',
  })
  kpiOwnershipType: KpiOwnershipType;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'kpi_for_group_id' })
  kpiForGroupId: number;

  @Column({
    type: 'enum',
    enum: Source,
    default: Source.SYSTEM,
    name: 'source',
  })
  source: Source;

  @Column({
    type: 'enum',
    enum: ItemApprovalStatus,
    nullable: true,
    name: 'item_approval_status',
  })
  itemApprovalStatus: ItemApprovalStatus;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'item_approver_employee_number' })
  itemApproverEmployeeNumber: string;

  @Column({ type: 'text', nullable: true, name: 'item_approver_text' })
  itemApproverText: string;

  @Column({ type: 'text', nullable: true, name: 'item_approver_notes' })
  itemApproverNotes: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'kpi_dictionary_id' })
  kpiDictionaryId: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'created_by_employee_number' })
  createdByEmployeeNumber: string;

  @Column({ type: 'text', nullable: true, name: 'created_by_text' })
  createdByText: string;

  @Column({ type: 'tinyint', width: 1, default: 1, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'text', nullable: true, name: 'title' })
  title: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string;

  @Column({ type: 'text', nullable: true, name: 'reference_requirement' })
  referenceRequirement: string;

  @Column({ type: 'text', nullable: true, name: 'function_mapping' })
  functionMapping: string;

  @Column({ type: 'int', nullable: true, name: 'cohort_mapping' })
  cohortMapping: number;

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

  @ManyToOne(() => KpiEntity, { nullable: true })
  @JoinColumn({ name: 'parent_kpi_id' })
  parentKpi: KpiEntity;

  // Employee relationships would be added when Employee entity is created
}
