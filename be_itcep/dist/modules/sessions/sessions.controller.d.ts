import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(dto: any): Promise<Partial<import("./entities/player-session.entity").PlayerSession> & import("./entities/player-session.entity").PlayerSession>;
    findAll(): Promise<import("./entities/player-session.entity").PlayerSession[]>;
    findOne(id: number): Promise<import("./entities/player-session.entity").PlayerSession | null>;
    update(id: number, dto: any): Promise<import("./entities/player-session.entity").PlayerSession | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
