import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Media } from '../../media/entities/media.entity';

@Entity()
export class CraftVillage {
  @PrimaryGeneratedColumn()
  village_id: number;

  @Column()
  name: string;

  @OneToMany(() => Media, (media) => media.village)
  media: Media[];
}