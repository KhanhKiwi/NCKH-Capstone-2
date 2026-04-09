import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    create(dto: any): Promise<Partial<import("./entities/media.entity").Media> & import("./entities/media.entity").Media>;
    findAll(): Promise<import("./entities/media.entity").Media[]>;
    findOne(id: number): Promise<import("./entities/media.entity").Media | null>;
    update(id: number, dto: any): Promise<import("./entities/media.entity").Media | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
