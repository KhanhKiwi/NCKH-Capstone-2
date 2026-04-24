import { User } from '../../users/entities/user.entity';
import { Level } from '../../levels/entities/level.entity';
import { Step } from '../../steps/entities/step.entity';
export declare class UserActionLog {
    log_id: number;
    user: User;
    level: Level;
    step: Step;
    action: string;
    is_correct: boolean;
    action_time: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
