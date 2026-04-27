import { LevelsService } from './levels.service';
export declare class LevelsController {
    private readonly levelsService;
    constructor(levelsService: LevelsService);
    create(dto: any): Promise<Partial<import("./entities/level.entity").Level> & import("./entities/level.entity").Level>;
    findAll(userId?: string): Promise<import("./entities/level.entity").Level[]>;
    findOne(id: number, userId?: string): Promise<import("./entities/level.entity").Level | {
        user_progress: import("../progress/entities/user-progress.entity").UserProgress | null;
        unlocked: boolean;
        level_id: number;
        craft: import("../crafts/entities/craft.entity").Craft;
        level_number: number;
        difficulty: string;
        steps: import("../steps/entities/step.entity").Step[];
        sessions: import("../sessions/entities/player-session.entity").PlayerSession[];
        progresses: import("../progress/entities/user-progress.entity").UserProgress[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    } | null>;
    update(id: number, dto: any): Promise<import("./entities/level.entity").Level | {
        user_progress: import("../progress/entities/user-progress.entity").UserProgress | null;
        unlocked: boolean;
        level_id: number;
        craft: import("../crafts/entities/craft.entity").Craft;
        level_number: number;
        difficulty: string;
        steps: import("../steps/entities/step.entity").Step[];
        sessions: import("../sessions/entities/player-session.entity").PlayerSession[];
        progresses: import("../progress/entities/user-progress.entity").UserProgress[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    } | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
    unlockLevel(levelId: number, userId: number): Promise<import("../progress/entities/user-progress.entity").UserProgress>;
}
