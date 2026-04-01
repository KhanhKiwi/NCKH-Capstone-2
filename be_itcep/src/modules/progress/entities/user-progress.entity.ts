import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @ManyToOne(() => User, (user) => user.progress)
  user: User;

  @ManyToOne(() => Level)
  level: Level;

  @Column()
  status: string;

  @Column()
  score: number;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;
}