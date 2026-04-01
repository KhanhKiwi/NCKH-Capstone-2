import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CraftVillage } from '../../villages/entities/craft-village.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  media_id: number;

  @ManyToOne(() => CraftVillage, (village) => village.media)
  village: CraftVillage;
}