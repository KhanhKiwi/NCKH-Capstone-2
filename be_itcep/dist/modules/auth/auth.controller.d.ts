import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        message: string;
        user_id: number;
    }>;
    login(body: any): Promise<{
        access_token: string;
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
}
