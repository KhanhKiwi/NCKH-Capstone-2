import { LevelsService } from './levels.service';
export declare class LevelsController {
    private readonly levelsService;
    constructor(levelsService: LevelsService);
    create(dto: any): Promise<Partial<import("./entities/level.entity").Level> & import("./entities/level.entity").Level>;
    findAll(): Promise<import("./entities/level.entity").Level[]>;
    findOne(id: number): Promise<import("./entities/level.entity").Level | null>;
    update(id: number, dto: any): Promise<import("./entities/level.entity").Level | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
    unlockLevel(levelId: number, userId: number): Promise<import("../progress/entities/user-progress.entity").UserProgress>;
}
