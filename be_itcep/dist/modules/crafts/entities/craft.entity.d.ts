import { Level } from '../../levels/entities/level.entity';
import { PlayerSession } from '../../sessions/entities/player-session.entity';
import { CraftVillage } from '../../villages/entities/craft-village.entity';
export declare class Craft {
    craft_id: number;
    name: string;
    description: string;
    village: CraftVillage;
    levels: Level[];
    sessions: PlayerSession[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
