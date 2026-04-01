import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class AnalyticsEvent {
  @PrimaryGeneratedColumn()
  event_id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  event_type: string;

  @Column('json')
  event_data: any;

  @Column()
  created_at: Date;
}