import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Craft } from '../../crafts/entities/craft.entity';
import { Step } from '../../steps/entities/step.entity';
import { UserProgress } from '../../progress/entities/user-progress.entity';

@Entity('Level')
export class Level {
  @PrimaryGeneratedColumn()
  level_id: number;

  @ManyToOne(() => Craft, (craft) => craft.levels)
  @JoinColumn({ name: 'craft_id' })
  craft: Craft;

  @Column({ nullable: true })
  level_number: number;

  @Column({ length: 50, nullable: true })
  difficulty: string;

  @OneToMany(() => Step, (step) => step.level)
  steps: Step[];

  // Player sessions are now associated with `Craft` (craft_id) instead of Level

  @OneToMany(() => UserProgress, (progress) => progress.level)
  progresses: UserProgress[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}