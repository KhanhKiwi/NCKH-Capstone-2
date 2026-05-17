import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserProgress } from '../../progress/entities/user-progress.entity';
import { PlayerSession } from '../../sessions/entities/player-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  username: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  avatar: string | null;

  @Column({ name: 'google_id', type: 'varchar', length: 100, nullable: true, unique: true })
  googleId: string | null;

  @Column({ name: 'reset_password_token', type: 'varchar', length: 255, nullable: true })
  resetPasswordToken: string | null;

  @Column({ name: 'reset_password_expires', type: 'datetime', nullable: true })
  resetPasswordExpires: Date | null;

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