import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
import { UserProgress } from '../progress/entities/user-progress.entity';
import { User } from '../users/entities/user.entity';
export declare class LevelsService {
    private levelRepo;
    private progressRepo;
    private userRepo;
    constructor(levelRepo: Repository<Level>, progressRepo: Repository<UserProgress>, userRepo: Repository<User>);
    create(dto: Partial<Level>): Promise<Partial<Level> & Level>;
    findAll(userId?: number): Promise<Level[]>;
    findOne(id: number, userId?: number): Promise<Level | {
        user_progress: UserProgress | null;
        unlocked: boolean;
        level_id: number;
        craft: import("../crafts/entities/craft.entity").Craft;
        level_number: number;
        difficulty: string;
        steps: import("../steps/entities/step.entity").Step[];
        progresses: UserProgress[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    } | null>;
    update(id: number, dto: Partial<Level>): Promise<Level | {
        user_progress: UserProgress | null;
        unlocked: boolean;
        level_id: number;
        craft: import("../crafts/entities/craft.entity").Craft;
        level_number: number;
        difficulty: string;
        steps: import("../steps/entities/step.entity").Step[];
        progresses: UserProgress[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    } | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
    unlockLevel(userId: number, levelId: number): Promise<UserProgress>;
}
