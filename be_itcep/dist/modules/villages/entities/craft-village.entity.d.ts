import { Media } from '../../media/entities/media.entity';
import { Craft } from '../../crafts/entities/craft.entity';
export declare class CraftVillage {
    village_id: number;
    name: string;
    description: string;
    image: string;
    city: string;
    media: Media[];
    crafts: Craft[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    is_open: boolean;
}
