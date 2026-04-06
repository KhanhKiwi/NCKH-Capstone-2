import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Media } from '../../media/entities/media.entity';
import { Craft } from '../../crafts/entities/craft.entity';

@Entity('Craft_Villages')
export class CraftVillage {
  @PrimaryGeneratedColumn()
  village_id: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => Media, (media) => media.village)
  media: Media[];

  @OneToMany(() => Craft, (craft) => craft.village)
  crafts: Craft[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}