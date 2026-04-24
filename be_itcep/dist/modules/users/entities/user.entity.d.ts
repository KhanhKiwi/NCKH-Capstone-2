import { UserProgress } from '../../progress/entities/user-progress.entity';
import { PlayerSession } from '../../sessions/entities/player-session.entity';
export declare class User {
    user_id: number;
    email: string | null;
    username: string | null;
    password: string | null;
    name: string | null;
    avatar: string | null;
    googleId: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    progress: UserProgress[];
    sessions: PlayerSession[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
