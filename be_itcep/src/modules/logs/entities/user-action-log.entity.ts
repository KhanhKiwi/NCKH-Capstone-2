import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';
import { Step } from '../../steps/entities/step.entity';

@Entity('UserActionLog')
export class UserActionLog {
  @PrimaryGeneratedColumn()
  log_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @ManyToOne(() => Step)
  @JoinColumn({ name: 'step_id' })
  step: Step;

  @Column({ length: 100, nullable: true })
  action: string;

  @Column({ nullable: true })
  is_correct: boolean;

  @Column({ nullable: true })
  action_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}