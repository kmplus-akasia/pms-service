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

@Entity('kpi_position_performance_score_v3')
@Index(['positionMasterVariantId', 'year', 'month'])
@Index(['aggregationDate'])
export class KpiPositionPerformanceScoreEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiPositionPerformanceScoreId: number;

  @Column({ type: 'bigint', nullable: false })
  positionMasterVariantId: number;

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

  // Position relationship would be added when Position entity is created
  // @ManyToOne(() => PositionMasterVariantEntity)
  // @JoinColumn({ name: 'position_master_variant_id' })
  // position: PositionMasterVariantEntity;
}
