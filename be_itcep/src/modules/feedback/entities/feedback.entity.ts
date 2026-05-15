import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('Feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  feedback_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text' })
  feedback_text: string;

  // support tri-state moderation status: 'pending' | 'approved' | 'rejected'
  @Column({ type: 'varchar', length: 32, default: 'pending' })
  resolved: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
