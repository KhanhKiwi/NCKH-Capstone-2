import { Repository } from 'typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
export declare class AnalyticsService {
    private repo;
    constructor(repo: Repository<AnalyticsEvent>);
    create(dto: Partial<AnalyticsEvent>): Promise<Partial<AnalyticsEvent> & AnalyticsEvent>;
    findAll(): Promise<AnalyticsEvent[]>;
    findOne(id: number): Promise<AnalyticsEvent | null>;
    update(id: number, dto: Partial<AnalyticsEvent>): Promise<AnalyticsEvent | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
