import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { CraftVillage } from '../../villages/entities/craft-village.entity';

@Entity('Media')
export class Media {
  @PrimaryGeneratedColumn()
  media_id: number;

  @ManyToOne(() => CraftVillage, (village) => village.media)
  @JoinColumn({ name: 'village_id' })
  village: CraftVillage;

  @Column('text', { nullable: true })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}