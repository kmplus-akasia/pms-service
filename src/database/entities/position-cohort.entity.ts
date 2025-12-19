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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cohortId: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  // Relationships would be added when other entities reference this
  // @OneToMany(() => CohortKpiFormulaEntity, (formula) => formula.cohort)
  // formulas: CohortKpiFormulaEntity[];
}
