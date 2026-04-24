import { User } from '../../users/entities/user.entity';
export declare class AnalyticsEvent {
    event_id: number;
    user: User;
    event_type: string;
    event_data: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
