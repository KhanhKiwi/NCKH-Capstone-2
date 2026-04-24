import { Repository } from 'typeorm';
import { Step } from './entities/step.entity';
export declare class StepsService {
    private repo;
    constructor(repo: Repository<Step>);
    create(dto: Partial<Step>): Promise<Partial<Step> & Step>;
    findAll(): Promise<Step[]>;
    findOne(id: number): Promise<Step | null>;
    update(id: number, dto: Partial<Step>): Promise<Step | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
