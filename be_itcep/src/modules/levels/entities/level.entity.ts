import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Craft } from '../../crafts/entities/craft.entity';
import { Step } from '../../steps/entities/step.entity';

@Entity()
export class Level {
  @PrimaryGeneratedColumn()
  level_id: number;

  @ManyToOne(() => Craft, (craft) => craft.levels)
  craft: Craft;

  @Column()
  level_number: number;

  @OneToMany(() => Step, (step) => step.level)
  steps: Step[];
}