import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';

@Entity()
export class PlayerSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @ManyToOne(() => Level)
  level: Level;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  total_time: number;
}