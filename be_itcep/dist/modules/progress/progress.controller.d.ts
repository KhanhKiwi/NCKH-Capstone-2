import { CreateProgressDto } from './dto/create-progress.dto';
import { UnlockLevelDto } from './dto/unlock-level.dto';
import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    save(dto: CreateProgressDto): Promise<import("./entities/user-progress.entity").UserProgress>;
    getForUser(id: number): Promise<import("./entities/user-progress.entity").UserProgress[]>;
    unlockLevel(dto: UnlockLevelDto): Promise<import("./entities/user-progress.entity").UserProgress>;
}
