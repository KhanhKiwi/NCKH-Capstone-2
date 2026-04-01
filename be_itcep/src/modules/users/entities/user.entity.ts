import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProgress } from '../../progress/entities/user-progress.entity';
import { PlayerSession } from '../../sessions/entities/player-session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress: UserProgress[];

  @OneToMany(() => PlayerSession, (session) => session.user)
  sessions: PlayerSession[];
}