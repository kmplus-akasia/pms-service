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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  kpiScheduleId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: ScheduleType,
    nullable: false,
  })
  type: ScheduleType;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  // Additional fields that might be added based on our guidelines
  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'int', nullable: true })
  quarter: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
