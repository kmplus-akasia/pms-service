import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum ScheduleType {
  PLANNING = 'PLANNING',
  ADJUSTMENT = 'ADJUSTMENT',
  MONITORING = 'MONITORING',
  CALIBRATION = 'CALIBRATION',
}

@Entity('kpi_schedule_v3')
@Index(['year', 'quarter'])
@Index(['type'])
@Index(['startDate', 'endDate'])
@Index(['isActive'])
export class KpiScheduleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'kpi_schedule_id' })
  kpiScheduleId: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'name' })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string;

  @Column({
    type: 'enum',
    enum: ScheduleType,
    nullable: false,
    name: 'type',
  })
  type: ScheduleType;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date;

  // Additional fields that might be added based on our guidelines
  @Column({ type: 'int', nullable: true, name: 'year' })
  year: number;

  @Column({ type: 'int', nullable: true, name: 'quarter' })
  quarter: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date;
}
