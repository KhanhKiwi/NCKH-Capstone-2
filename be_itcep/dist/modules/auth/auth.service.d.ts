import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(email: string, passwordHash: string, name: string): Promise<{
        message: string;
        user_id: number;
    }>;
    login(identifier: string, pass: string): Promise<{
        access_token: string;
    }>;
    googleLogin(req: any): Promise<{
        access_token: string;
    }>;
}
