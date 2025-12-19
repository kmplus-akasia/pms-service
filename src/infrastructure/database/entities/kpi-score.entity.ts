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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiScoreId: number;

  @Column({ type: 'bigint', nullable: false })
  kpiId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  employeeNumber: string;

  @Column({ type: 'float', nullable: true })
  realization: number;

  @Column({ type: 'float', nullable: true })
  target: number;

  @Column({
    type: 'enum',
    enum: Polarity,
    nullable: true,
  })
  polarity: Polarity;

  @Column({ type: 'float', nullable: true })
  score: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  weightedScore: number;

  @Column({ type: 'int', nullable: true })
  month: number;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'date', nullable: true })
  conclusionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
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
