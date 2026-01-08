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
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_employee_performance_score_final_id' })
  kpiEmployeePerformanceScoreFinalId: number;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'employee_number' })
  employeeNumber: string;

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

  // Employee relationship would be added when Employee entity is created
  // @ManyToOne(() => EmployeeEntity)
  // @JoinColumn({ name: 'employee_number' })
  // employee: EmployeeEntity;
}
