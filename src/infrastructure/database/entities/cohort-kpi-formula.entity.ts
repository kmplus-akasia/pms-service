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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cohortKpiFormulaId: number;

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
  @ManyToOne(() => PositionCohortEntity)
  @JoinColumn({ name: 'cohort_id' })
  cohort: PositionCohortEntity;
}
