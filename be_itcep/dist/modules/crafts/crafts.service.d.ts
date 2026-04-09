import { Repository } from 'typeorm';
import { Craft } from './entities/craft.entity';
export declare class CraftsService {
    private repo;
    constructor(repo: Repository<Craft>);
    create(dto: Partial<Craft>): Promise<Partial<Craft> & Craft>;
    findAll(): Promise<Craft[]>;
    findOne(id: number): Promise<Craft | null>;
    update(id: number, dto: Partial<Craft>): Promise<Craft | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
