import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Level } from '../../levels/entities/level.entity';

@Entity()
export class Craft {
  @PrimaryGeneratedColumn()
  craft_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Level, (level) => level.craft)
  levels: Level[];
}