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
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_realization_id' })
  kpiRealizationId: number;

  @Column({ type: 'bigint', nullable: false, name: 'kpi_id' })
  kpiId: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'employee_number' })
  employeeNumber: string;

  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string;

  @Column({ type: 'float', nullable: true, name: 'realization' })
  realization: number;

  @Column({ type: 'bigint', nullable: true, name: 'file_id' })
  fileId: number;

  @Column({
    type: 'enum',
    enum: Source,
    default: Source.SYSTEM,
    name: 'source',
  })
  source: Source;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    nullable: true,
    name: 'submission_status',
  })
  submissionStatus: SubmissionStatus;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    nullable: true,
    name: 'approval_status',
  })
  approvalStatus: ApprovalStatus;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'approver_employee_number' })
  approverEmployeeNumber: string;

  @Column({ type: 'text', nullable: true, name: 'approver_employee_text' })
  approverEmployeeText: string;

  @Column({ type: 'text', nullable: true, name: 'approval_notes' })
  approvalNotes: string;

  @Column({ type: 'date', nullable: true, name: 'submit_date' })
  submitDate: Date;

  @Column({ type: 'date', nullable: true, name: 'generated_date' })
  generatedDate: Date;

  @Column({ type: 'int', nullable: true, name: 'day' })
  day: number;

  @Column({ type: 'int', nullable: true, name: 'week' })
  week: number;

  @Column({ type: 'int', nullable: true, name: 'month' })
  month: number;

  @Column({ type: 'int', nullable: true, name: 'year' })
  year: number;

  @Column({ type: 'boolean', default: false, name: 'is_concluded' })
  isConcluded: boolean;

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
  // @JoinColumn({ name: 'approver_employee_number' })
  // approver: EmployeeEntity;

  // File relationship would be added when File entity is created
  // @ManyToOne(() => FileEntity)
  // @JoinColumn({ name: 'file_id' })
  // file: FileEntity;
}
