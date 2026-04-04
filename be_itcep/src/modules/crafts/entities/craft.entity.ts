import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Level } from '../../levels/entities/level.entity';
import { CraftVillage } from '../../villages/entities/craft-village.entity';

@Entity('Craft')
export class Craft {
  @PrimaryGeneratedColumn()
  craft_id: number;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => CraftVillage, (village) => village.crafts)
  @JoinColumn({ name: 'village_id' })
  village: CraftVillage;

  @OneToMany(() => Level, (level) => level.craft)
  levels: Level[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}