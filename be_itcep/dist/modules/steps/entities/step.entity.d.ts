import { Level } from '../../levels/entities/level.entity';
export declare class Step {
    step_id: number;
    level: Level;
    step_order: number;
    description: string;
    correct_action: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
