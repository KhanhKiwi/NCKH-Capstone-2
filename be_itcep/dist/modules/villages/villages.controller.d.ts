import { VillagesService } from './villages.service';
export declare class VillagesController {
    private readonly villagesService;
    constructor(villagesService: VillagesService);
    create(dto: any): Promise<Partial<import("./entities/craft-village.entity").CraftVillage> & import("./entities/craft-village.entity").CraftVillage>;
    findAll(): Promise<import("./entities/craft-village.entity").CraftVillage[]>;
    findOne(id: number): Promise<import("./entities/craft-village.entity").CraftVillage | null>;
    update(id: number, dto: any): Promise<import("./entities/craft-village.entity").CraftVillage | null>;
    setOpen(id: number, open: boolean): Promise<import("./entities/craft-village.entity").CraftVillage>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
