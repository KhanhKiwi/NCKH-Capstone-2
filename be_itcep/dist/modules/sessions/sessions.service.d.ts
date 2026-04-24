import { Repository } from 'typeorm';
import { PlayerSession } from './entities/player-session.entity';
export declare class SessionsService {
    private repo;
    constructor(repo: Repository<PlayerSession>);
    create(dto: Partial<PlayerSession>): Promise<Partial<PlayerSession> & PlayerSession>;
    findAll(): Promise<PlayerSession[]>;
    findOne(id: number): Promise<PlayerSession | null>;
    update(id: number, dto: Partial<PlayerSession>): Promise<PlayerSession | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
