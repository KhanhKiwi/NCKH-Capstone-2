import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserProgress } from '../../progress/entities/user-progress.entity';
import { PlayerSession } from '../../sessions/entities/player-session.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ length: 100, nullable: true })
  name: string;

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress: UserProgress[];

  @OneToMany(() => PlayerSession, (session) => session.user)
  sessions: PlayerSession[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}