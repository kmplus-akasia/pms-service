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
import { KpiEntity, Polarity } from './kpi.entity';

@Entity('kpi_score_v3')
@Index(['year', 'month'])
@Index(['employeeNumber', 'year'])
@Index(['kpiId', 'year', 'month'])
@Index(['conclusionDate', 'employeeNumber'])
export class KpiScoreEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_score_id' })
  kpiScoreId: number;

  @Column({ type: 'bigint', nullable: false, name: 'kpi_id' })
  kpiId: number;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'employee_number' })
  employeeNumber: string;

  @Column({ type: 'float', nullable: true, name: 'realization' })
  realization: number;

  @Column({ type: 'float', nullable: true, name: 'target' })
  target: number;

  @Column({
    type: 'enum',
    enum: Polarity,
    nullable: true,
    name: 'polarity',
  })
  polarity: Polarity;

  @Column({ type: 'float', nullable: true, name: 'score' })
  score: number;

  @Column({ type: 'float', nullable: true, name: 'weight' })
  weight: number;

  @Column({ type: 'float', nullable: true, name: 'weighted_score' })
  weightedScore: number;

  @Column({ type: 'int', nullable: true, name: 'month' })
  month: number;

  @Column({ type: 'int', nullable: true, name: 'year' })
  year: number;

  @Column({ type: 'date', nullable: true, name: 'conclusion_date' })
  conclusionDate: Date;

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

  // Employee relationship would be added when Employee entity is created
  // @ManyToOne(() => EmployeeEntity)
  // @JoinColumn({ name: 'employee_number' })
  // employee: EmployeeEntity;
}
