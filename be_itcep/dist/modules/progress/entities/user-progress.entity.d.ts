import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';
export declare class UserProgress {
    progress_id: number;
    user: User;
    level: Level;
    status: string;
    score: number;
    completed_at: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
