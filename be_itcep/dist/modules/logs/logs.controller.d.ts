import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    create(dto: any): Promise<Partial<import("./entities/user-action-log.entity").UserActionLog> & import("./entities/user-action-log.entity").UserActionLog>;
    findAll(): Promise<import("./entities/user-action-log.entity").UserActionLog[]>;
    findOne(id: number): Promise<import("./entities/user-action-log.entity").UserActionLog | null>;
    update(id: number, dto: any): Promise<import("./entities/user-action-log.entity").UserActionLog | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
