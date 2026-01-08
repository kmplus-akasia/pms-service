import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('kpi_position_performance_score_final_v3')
@Index(['positionMasterVariantId', 'year', 'quarter'])
export class KpiPositionPerformanceScoreFinalEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_position_performance_score_final_id' })
  kpiPositionPerformanceScoreFinalId: number;

  @Column({ type: 'bigint', nullable: false, name: 'position_master_variant_id' })
  positionMasterVariantId: number;

  @Column({ type: 'float', nullable: true, name: 'performance_score_final' })
  performanceScoreFinal: number;

  @Column({ type: 'float', nullable: true, name: 'performance_score_base' })
  performanceScoreBase: number;

  @Column({ type: 'float', nullable: true, name: 'addition_score' })
  additionScore: number;

  @Column({ type: 'float', nullable: true, name: 'boundary_score' })
  boundaryScore: number;

  @Column({ type: 'int', nullable: true, name: 'quarter' })
  quarter: number;

  @Column({ type: 'int', nullable: true, name: 'year' })
  year: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  // Position relationship would be added when Position entity is created
  // @ManyToOne(() => PositionMasterVariantEntity)
  // @JoinColumn({ name: 'position_master_variant_id' })
  // position: PositionMasterVariantEntity;
}
