import { Repository } from 'typeorm';
import { UserActionLog } from './entities/user-action-log.entity';
export declare class LogsService {
    private repo;
    constructor(repo: Repository<UserActionLog>);
    create(dto: Partial<UserActionLog>): Promise<Partial<UserActionLog> & UserActionLog>;
    findAll(): Promise<UserActionLog[]>;
    findOne(id: number): Promise<UserActionLog | null>;
    update(id: number, dto: Partial<UserActionLog>): Promise<UserActionLog | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
