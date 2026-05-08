import { Craft } from '../../crafts/entities/craft.entity';
import { Step } from '../../steps/entities/step.entity';
import { UserProgress } from '../../progress/entities/user-progress.entity';
export declare class Level {
    level_id: number;
    craft: Craft;
    level_number: number;
    difficulty: string;
    steps: Step[];
    progresses: UserProgress[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
