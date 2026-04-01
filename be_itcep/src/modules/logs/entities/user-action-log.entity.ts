import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';
import { Step } from '../../steps/entities/step.entity';

@Entity()
export class UserActionLog {
  @PrimaryGeneratedColumn()
  log_id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Level)
  level: Level;

  @ManyToOne(() => Step)
  step: Step;

  @Column()
  action: string;

  @Column()
  is_correct: boolean;

  @Column()
  action_time: Date;
}