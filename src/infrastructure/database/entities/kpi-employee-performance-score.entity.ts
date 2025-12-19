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
import { CohortKpiFormulaEntity } from './cohort-kpi-formula.entity';

@Entity('kpi_employee_performance_score_v3')
@Index(['employeeNumber', 'year', 'month'])
@Index(['aggregationDate'])
export class KpiEmployeePerformanceScoreEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiEmployeePerformanceScoreId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  employeeNumber: string;

  @Column({ type: 'float', nullable: true })
  finalScore: number;

  @Column({ type: 'float', nullable: true })
  kpiScore: number;

  @Column({ type: 'float', nullable: true })
  outputScore: number;

  @Column({ type: 'float', nullable: true })
  impactScore: number;

  @Column({ type: 'float', nullable: true })
  boundaryScore: number;

  @Column({ type: 'float', nullable: true })
  kpiScoreWeight: number;

  @Column({ type: 'float', nullable: true })
  outputScoreWeight: number;

  @Column({ type: 'float', nullable: true })
  impactScoreWeight: number;

  @Column({ type: 'bigint', nullable: true })
  cohortKpiFormulaId: number;

  @Column({ type: 'text', nullable: true })
  kpiKpiIds: string; // JSON string of KPI IDs

  @Column({ type: 'text', nullable: true })
  outputKpiIds: string; // JSON string of KPI IDs

  @Column({ type: 'text', nullable: true })
  impactKpiIds: string; // JSON string of KPI IDs

  @Column({ type: 'int', nullable: true })
  month: number;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'date', nullable: true })
  aggregationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  // Relationships
  @ManyToOne(() => CohortKpiFormulaEntity)
  @JoinColumn({ name: 'cohort_kpi_formula_id' })
  cohortKpiFormula: CohortKpiFormulaEntity;

  // Employee relationship would be added when Employee entity is created
  // @ManyToOne(() => EmployeeEntity)
  // @JoinColumn({ name: 'employee_number' })
  // employee: EmployeeEntity;
}
