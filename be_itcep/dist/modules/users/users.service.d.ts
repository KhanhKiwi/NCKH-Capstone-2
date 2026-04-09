import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    create(dto: Partial<User>): Promise<Partial<User> & User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByEmailOrUsername(identifier: string): Promise<User | null>;
    update(id: number, dto: Partial<User>): Promise<User | null>;
    changePassword(id: number, currentPassword: string, newPassword: string): Promise<User | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
