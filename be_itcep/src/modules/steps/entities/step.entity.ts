import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Level } from '../../levels/entities/level.entity';

@Entity('Step')
export class Step {
  @PrimaryGeneratedColumn()
  step_id: number;

  @ManyToOne(() => Level, (level) => level.steps)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @Column({ nullable: true })
  step_order: number;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  correct_action: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}