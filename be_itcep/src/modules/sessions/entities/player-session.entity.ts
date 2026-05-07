import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Craft } from '../../crafts/entities/craft.entity';

@Entity('Player_Sessions')
export class PlayerSession {
  @PrimaryGeneratedColumn()
  session_id: number;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Craft, (craft) => craft.sessions)
  @JoinColumn({ name: 'craft_id' })
  craft: Craft;

  @Column({ nullable: true })
  start_time: Date;

  @Column({ nullable: true })
  end_time: Date;

  @Column({ nullable: true })
  total_time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}