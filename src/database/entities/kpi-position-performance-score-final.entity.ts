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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiPositionPerformanceScoreFinalId: number;

  @Column({ type: 'bigint', nullable: false })
  positionMasterVariantId: number;

  @Column({ type: 'float', nullable: true })
  performanceScoreFinal: number;

  @Column({ type: 'float', nullable: true })
  performanceScoreBase: number;

  @Column({ type: 'float', nullable: true })
  additionScore: number;

  @Column({ type: 'float', nullable: true })
  boundaryScore: number;

  @Column({ type: 'int', nullable: true })
  quarter: number;

  @Column({ type: 'int', nullable: true })
  year: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  // Position relationship would be added when Position entity is created
  // @ManyToOne(() => PositionMasterVariantEntity)
  // @JoinColumn({ name: 'position_master_variant_id' })
  // position: PositionMasterVariantEntity;
}
