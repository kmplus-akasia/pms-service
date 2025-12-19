import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';

export enum KpiType {
  IMPACT = 'IMPACT',
  OUTPUT = 'OUTPUT',
  KAI = 'KAI',
}

export enum NatureOfWork {
  STATIC = 'STATIC',
  PROGRESSING = 'PROGRESSING',
}

export enum CascadingMethod {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
}

export enum Polarity {
  NEUTRAL = 'NEUTRAL',
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

export enum MonitoringPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export enum KpiOwnershipType {
  SPECIFIC = 'SPECIFIC',
  SHARED = 'SHARED',
  COMMON = 'COMMON',
}

export enum Source {
  SYSTEM = 'SYSTEM',
  MIGRATION = 'MIGRATION',
}

export enum TargetType {
  FIXED = 'FIXED',
  PROGRESSIVE = 'PROGRESSIVE',
}

export enum ItemApprovalStatus {
  DRAFT = 'DRAFT',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  REJECTED = 'REJECTED',
  READY = 'READY',
  APPROVED = 'APPROVED',
}

@Entity('kpi_v3')
@Index(['parentKpiId'])
@Index(['createdByEmployeeNumber'])
@Index(['itemApproverEmployeeNumber'])
@Index(['type', 'isActive'])
@Index(['source'])
@Index(['kpiDictionaryId'])
@Index(['monitoringPeriod'])
@Index(['itemApprovalStatus'])
@Index(['cohortMapping', 'type'])
export class KpiEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  kpiId: number;

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

  // Self-referencing relationship for parent-child
  @ManyToOne(() => KpiEntity, { nullable: true })
  @JoinColumn({ name: 'parent_kpi_id' })
  parentKpi: KpiEntity;

  @OneToMany(() => KpiEntity, (kpi) => kpi.parentKpi)
  childKpis: KpiEntity[];

  // Relationships with other entities would be added here
  // (Employee relationships would be added when Employee entity is created)
}
