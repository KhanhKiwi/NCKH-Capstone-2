import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';
export declare class Feedback {
    feedback_id: number;
    user: User;
    user_id: number;
    level: Level;
    level_id: number;
    message: string;
    rating: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
