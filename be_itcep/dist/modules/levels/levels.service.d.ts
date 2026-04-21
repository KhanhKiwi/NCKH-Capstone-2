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
    findAll(): Promise<Level[]>;
    findOne(id: number): Promise<Level | null>;
    update(id: number, dto: Partial<Level>): Promise<Level | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
    unlockLevel(userId: number, levelId: number): Promise<UserProgress>;
}
