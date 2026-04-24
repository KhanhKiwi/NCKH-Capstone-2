import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<import("./entities/user.entity").User | null>;
    updateProfile(user: any, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User | null>;
    changePassword(user: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<import("./entities/user.entity").User | null>;
    uploadAvatar(user: any, file: any): Promise<import("./entities/user.entity").User | null>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: number): Promise<import("./entities/user.entity").User | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
