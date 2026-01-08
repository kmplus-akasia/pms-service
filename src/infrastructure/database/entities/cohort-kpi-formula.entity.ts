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
import { PositionCohortEntity } from './position-cohort.entity';

@Entity('cohort_kpi_formula')
@Index(['cohortId'])
@Index(['cohortId', 'version'])
export class CohortKpiFormulaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'cohort_kpi_formula_id' })
  cohortKpiFormulaId: number;

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
  @ManyToOne(() => PositionCohortEntity)
  @JoinColumn({ name: 'cohort_id' })
  cohort: PositionCohortEntity;
}
