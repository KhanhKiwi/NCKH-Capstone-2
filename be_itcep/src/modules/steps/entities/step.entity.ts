import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Level } from '../../levels/entities/level.entity';

@Entity()
export class Step {
  @PrimaryGeneratedColumn()
  step_id: number;

  @ManyToOne(() => Level, (level) => level.steps)
  level: Level;

  @Column()
  step_order: number;

  @Column()
  description: string;

  @Column()
  correct_action: string;
}