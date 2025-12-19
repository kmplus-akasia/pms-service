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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiLogId: number;

  @Column({ type: 'bigint', nullable: false })
  kpiId: number;

  @Column({ type: 'text', nullable: true })
  logNotes: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  parentKpiId: number;

  @Column({
    type: 'enum',
    enum: KpiType,
    nullable: false,
  })
  type: KpiType;

  @Column({
    type: 'enum',
    enum: NatureOfWork,
    nullable: true,
  })
  natureOfWork: NatureOfWork;

  @Column({
    type: 'enum',
    enum: CascadingMethod,
    nullable: true,
  })
  cascadingMethod: CascadingMethod;

  @Column({ type: 'text', nullable: true })
  formula: string;

  @Column({ type: 'float', nullable: true })
  target: number;

  @Column({ type: 'varchar', length: 25, nullable: true })
  targetUnit: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  perspective: string;

  @Column({
    type: 'enum',
    enum: Polarity,
    nullable: true,
  })
  polarity: Polarity;

  @Column({
    type: 'enum',
    enum: MonitoringPeriod,
    nullable: false,
  })
  monitoringPeriod: MonitoringPeriod;

  @Column({
    type: 'enum',
    enum: KpiOwnershipType,
    nullable: true,
  })
  kpiOwnershipType: KpiOwnershipType;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  kpiForGroupId: number;

  @Column({
    type: 'enum',
    enum: Source,
    default: Source.SYSTEM,
  })
  source: Source;

  @Column({
    type: 'enum',
    enum: ItemApprovalStatus,
    nullable: true,
  })
  itemApprovalStatus: ItemApprovalStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  itemApproverEmployeeNumber: string;

  @Column({ type: 'text', nullable: true })
  itemApproverText: string;

  @Column({ type: 'text', nullable: true })
  itemApproverNotes: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  kpiDictionaryId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdByEmployeeNumber: string;

  @Column({ type: 'text', nullable: true })
  createdByText: string;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  referenceRequirement: string;

  @Column({ type: 'text', nullable: true })
  functionMapping: string;

  @Column({ type: 'int', nullable: true })
  cohortMapping: number;

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

  @ManyToOne(() => KpiEntity, { nullable: true })
  @JoinColumn({ name: 'parent_kpi_id' })
  parentKpi: KpiEntity;

  // Employee relationships would be added when Employee entity is created
}
