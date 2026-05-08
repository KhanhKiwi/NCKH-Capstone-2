import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Craft } from '../../crafts/entities/craft.entity';

@Entity('UserChallenge')
export class UserChallenge {
  @PrimaryGeneratedColumn()
  user_challenge_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Craft)
  @JoinColumn({ name: 'craft_id' })
  craft: Craft;

  @Column({ nullable: true })
  time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
