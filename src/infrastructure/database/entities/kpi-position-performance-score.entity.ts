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
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_position_performance_score_id' })
  kpiPositionPerformanceScoreId: number;

  @Column({ type: 'bigint', nullable: false, name: 'position_master_variant_id' })
  positionMasterVariantId: number;

  @Column({ type: 'float', nullable: true, name: 'final_score' })
  finalScore: number;

  @Column({ type: 'float', nullable: true, name: 'kpi_score' })
  kpiScore: number;

  @Column({ type: 'float', nullable: true, name: 'output_score' })
  outputScore: number;

  @Column({ type: 'float', nullable: true, name: 'impact_score' })
  impactScore: number;

  @Column({ type: 'float', nullable: true, name: 'boundary_score' })
  boundaryScore: number;

  @Column({ type: 'float', nullable: true, name: 'kpi_score_weight' })
  kpiScoreWeight: number;

  @Column({ type: 'float', nullable: true, name: 'output_score_weight' })
  outputScoreWeight: number;

  @Column({ type: 'float', nullable: true, name: 'impact_score_weight' })
  impactScoreWeight: number;

  @Column({ type: 'bigint', nullable: true, name: 'cohort_kpi_formula_id' })
  cohortKpiFormulaId: number;

  @Column({ type: 'text', nullable: true, name: 'kpi_kpi_ids' })
  kpiKpiIds: string; // JSON string of KPI IDs

  @Column({ type: 'text', nullable: true, name: 'output_kpi_ids' })
  outputKpiIds: string; // JSON string of KPI IDs

  @Column({ type: 'text', nullable: true, name: 'impact_kpi_ids' })
  impactKpiIds: string; // JSON string of KPI IDs

  @Column({ type: 'int', nullable: true, name: 'month' })
  month: number;

  @Column({ type: 'int', nullable: true, name: 'year' })
  year: number;

  @Column({ type: 'date', nullable: true, name: 'aggregation_date' })
  aggregationDate: Date;

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

  // Position relationship would be added when Position entity is created
  // @ManyToOne(() => PositionMasterVariantEntity)
  // @JoinColumn({ name: 'position_master_variant_id' })
  // position: PositionMasterVariantEntity;
}
