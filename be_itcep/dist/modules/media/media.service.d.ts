import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
export declare class MediaService {
    private repo;
    constructor(repo: Repository<Media>);
    create(dto: Partial<Media>): Promise<Partial<Media> & Media>;
    findAll(): Promise<Media[]>;
    findOne(id: number): Promise<Media | null>;
    findByVillage(villageId: number): Promise<Media[]>;
    update(id: number, dto: Partial<Media>): Promise<Media | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
