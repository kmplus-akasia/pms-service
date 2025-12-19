import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('kpi_employee_performance_score_final_v3')
@Index(['employeeNumber', 'year', 'quarter'])
export class KpiEmployeePerformanceScoreFinalEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiEmployeePerformanceScoreFinalId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  employeeNumber: string;

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

  // Employee relationship would be added when Employee entity is created
  // @ManyToOne(() => EmployeeEntity)
  // @JoinColumn({ name: 'employee_number' })
  // employee: EmployeeEntity;
}
