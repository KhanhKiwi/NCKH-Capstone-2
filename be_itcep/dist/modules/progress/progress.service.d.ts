import { Repository } from 'typeorm';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UserProgress } from './entities/user-progress.entity';
import { Level } from '../levels/entities/level.entity';
import { User } from '../users/entities/user.entity';
export declare class ProgressService {
    private readonly progressRepo;
    private readonly levelRepo;
    private readonly userRepo;
    constructor(progressRepo: Repository<UserProgress>, levelRepo: Repository<Level>, userRepo: Repository<User>);
    saveProgress(dto: CreateProgressDto): Promise<UserProgress>;
    getProgressForUser(user_id: number): Promise<UserProgress[]>;
}
