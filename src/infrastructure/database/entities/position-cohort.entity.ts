import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('position_cohort')
@Index(['name'])
export class PositionCohortEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'cohort_id' })
  cohortId: number;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  // Relationships would be added when other entities reference this
  // @OneToMany(() => CohortKpiFormulaEntity, (formula) => formula.cohort)
  // formulas: CohortKpiFormulaEntity[];
}
