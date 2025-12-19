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
import { PositionCohortEntity } from './position-cohort.entity';

@Entity('cohort_kpi_formula_log')
@Index(['cohortKpiFormulaId'])
@Index(['createdAt', 'cohortKpiFormulaId'])
export class CohortKpiFormulaLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cohortKpiFormulaLogId: number;

  @Column({ type: 'bigint', nullable: false })
  cohortKpiFormulaId: number;

  @Column({ type: 'text', nullable: true })
  logNotes: string;

  @Column({ type: 'bigint', nullable: false })
  cohortId: number;

  @Column({ type: 'float', nullable: true })
  kpiScoreWeight: number;

  @Column({ type: 'float', nullable: true })
  outputScoreWeight: number;

  @Column({ type: 'float', nullable: true })
  impactScoreWeight: number;

  @Column({ type: 'int' })
  version: number;

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

  @ManyToOne(() => PositionCohortEntity)
  @JoinColumn({ name: 'cohort_id' })
  cohort: PositionCohortEntity;
}
