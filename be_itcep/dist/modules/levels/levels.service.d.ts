import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
export declare class LevelsService {
    private repo;
    constructor(repo: Repository<Level>);
    create(dto: Partial<Level>): Promise<Partial<Level> & Level>;
    findAll(): Promise<Level[]>;
    findOne(id: number): Promise<Level | null>;
    update(id: number, dto: Partial<Level>): Promise<Level | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
