import { User } from '../../users/entities/user.entity';
import { Craft } from '../../crafts/entities/craft.entity';
export declare class PlayerSession {
    session_id: number;
    user: User;
    craft: Craft;
    start_time: Date;
    end_time: Date;
    total_time: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
