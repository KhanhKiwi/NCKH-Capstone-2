import { CraftsService } from './crafts.service';
export declare class CraftsController {
    private readonly craftsService;
    constructor(craftsService: CraftsService);
    create(dto: any): Promise<Partial<import("./entities/craft.entity").Craft> & import("./entities/craft.entity").Craft>;
    findAll(): Promise<import("./entities/craft.entity").Craft[]>;
    findOne(id: number): Promise<import("./entities/craft.entity").Craft | null>;
    update(id: number, dto: any): Promise<import("./entities/craft.entity").Craft | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
