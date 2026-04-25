import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';

@Entity('UserProgress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  progress_id: number;

  @ManyToOne(() => User, (user) => user.progress)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Level, (level) => level.progresses)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @Column({ length: 20, nullable: true })
  status: string;

  @Column({ nullable: true })
  star: number;

  @Column({ nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}