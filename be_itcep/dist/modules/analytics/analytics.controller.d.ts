import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    create(dto: any): Promise<Partial<import("./entities/analytics-event.entity").AnalyticsEvent> & import("./entities/analytics-event.entity").AnalyticsEvent>;
    findAll(): Promise<import("./entities/analytics-event.entity").AnalyticsEvent[]>;
    findOne(id: number): Promise<import("./entities/analytics-event.entity").AnalyticsEvent | null>;
    update(id: number, dto: any): Promise<import("./entities/analytics-event.entity").AnalyticsEvent | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
