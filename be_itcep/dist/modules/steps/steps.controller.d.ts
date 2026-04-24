import { StepsService } from './steps.service';
export declare class StepsController {
    private readonly stepsService;
    constructor(stepsService: StepsService);
    create(dto: any): Promise<Partial<import("./entities/step.entity").Step> & import("./entities/step.entity").Step>;
    findAll(): Promise<import("./entities/step.entity").Step[]>;
    findOne(id: number): Promise<import("./entities/step.entity").Step | null>;
    update(id: number, dto: any): Promise<import("./entities/step.entity").Step | null>;
    remove(id: number): Promise<import("typeorm").UpdateResult>;
}
