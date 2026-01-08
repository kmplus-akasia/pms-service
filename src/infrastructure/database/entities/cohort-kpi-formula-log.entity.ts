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
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'cohort_kpi_formula_log_id' })
  cohortKpiFormulaLogId: number;

  @Column({ type: 'bigint', nullable: false, name: 'cohort_kpi_formula_id' })
  cohortKpiFormulaId: number;

  @Column({ type: 'text', nullable: true, name: 'log_notes' })
  logNotes: string;

  @Column({ type: 'bigint', nullable: false, name: 'cohort_id' })
  cohortId: number;

  @Column({ type: 'float', nullable: true, name: 'kpi_score_weight' })
  kpiScoreWeight: number;

  @Column({ type: 'float', nullable: true, name: 'output_score_weight' })
  outputScoreWeight: number;

  @Column({ type: 'float', nullable: true, name: 'impact_score_weight' })
  impactScoreWeight: number;

  @Column({ type: 'int', name: 'version' })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  // Relationships
  @ManyToOne(() => CohortKpiFormulaEntity)
  @JoinColumn({ name: 'cohort_kpi_formula_id' })
  cohortKpiFormula: CohortKpiFormulaEntity;

  @ManyToOne(() => PositionCohortEntity)
  @JoinColumn({ name: 'cohort_id' })
  cohort: PositionCohortEntity;
}
