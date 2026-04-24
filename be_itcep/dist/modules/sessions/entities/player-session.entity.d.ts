import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';
export declare class PlayerSession {
    session_id: number;
    user: User;
    level: Level;
    start_time: Date;
    end_time: Date;
    total_time: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
