import { Level } from '../../levels/entities/level.entity';
import { CraftVillage } from '../../villages/entities/craft-village.entity';
export declare class Craft {
    craft_id: number;
    name: string;
    description: string;
    village: CraftVillage;
    levels: Level[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
