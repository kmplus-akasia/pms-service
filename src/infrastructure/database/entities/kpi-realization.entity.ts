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
import { Source } from './kpi.entity';

export enum SubmissionStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
}

export enum ApprovalStatus {
  DRAFT = 'DRAFT',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

@Entity('kpi_realization_v3')
@Index(['year', 'month'])
@Index(['submissionStatus', 'approvalStatus'])
@Index(['employeeNumber', 'year', 'month'])
@Index(['approverEmployeeNumber', 'approvalStatus'])
@Index(['isConcluded', 'year', 'month'])
@Index(['source'])
@Index(['year', 'week'])
export class KpiRealizationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiRealizationId: number;

  @Column({ type: 'bigint', nullable: false })
  kpiId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  employeeNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'float', nullable: true })
  realization: number;

  @Column({ type: 'bigint', nullable: true })
  fileId: number;

  @Column({
    type: 'enum',
    enum: Source,
    default: Source.SYSTEM,
  })
  source: Source;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    nullable: true,
  })
  submissionStatus: SubmissionStatus;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    nullable: true,
  })
  approvalStatus: ApprovalStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  approverEmployeeNumber: string;

  @Column({ type: 'text', nullable: true })
  approverEmployeeText: string;

  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  @Column({ type: 'date', nullable: true })
  submitDate: Date;

  @Column({ type: 'date', nullable: true })
  generatedDate: Date;

  @Column({ type: 'int', nullable: true })
  day: number;

  @Column({ type: 'int', nullable: true })
  week: number;

  @Column({ type: 'int', nullable: true })
  month: number;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'boolean', default: false })
  isConcluded: boolean;

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
  // @JoinColumn({ name: 'approver_employee_number' })
  // approver: EmployeeEntity;

  // File relationship would be added when File entity is created
  // @ManyToOne(() => FileEntity)
  // @JoinColumn({ name: 'file_id' })
  // file: FileEntity;
}
