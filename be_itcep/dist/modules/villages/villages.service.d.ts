import { Repository } from 'typeorm';
import { CraftVillage } from './entities/craft-village.entity';
export declare class VillagesService {
    private repo;
    constructor(repo: Repository<CraftVillage>);
    create(dto: Partial<CraftVillage>): Promise<Partial<CraftVillage> & CraftVillage>;
    findAll(): Promise<CraftVillage[]>;
    findOne(id: number): Promise<CraftVillage | null>;
    update(id: number, dto: Partial<CraftVillage>): Promise<CraftVillage | null>;
    setOpenStatus(id: number, open: boolean): Promise<CraftVillage>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
