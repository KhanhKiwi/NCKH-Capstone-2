import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../modules/users/entities/user.entity';
import { UserProgress } from '../modules/progress/entities/user-progress.entity';
import { Level } from '../modules/levels/entities/level.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailService } from '../common/mail/mail.service';
import { ProgressService } from '../modules/progress/progress.service';
import { REDIS_CLIENT } from '../common/redis/redis.constants';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProgress)
    private readonly progressRepo: Repository<UserProgress>,
    @InjectRepository(Level)
    private readonly levelRepo: Repository<Level>,
    private readonly progressService: ProgressService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  private readonly logger = new Logger('AuthService');

  async register(registerDto: RegisterDto) {
    const { email, password, name, username } = registerDto;
    
    // Check if email already exists
    const existingEmail = await this.usersRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Check if username already exists
    const existingUsername = await this.usersRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException('Tên đăng ký đã được sử dụng, vui lòng chọn tên khác.');
    }

    // Check if name already exists
    const existingName = await this.usersRepository.findOne({ where: { name } });
    if (existingName) {
      throw new ConflictException('Tên này đã có người sử dụng, vui lòng chọn tên khác.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      name: name || '',
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Seed UserProgress rows for this new user
    try {
      this.logger.log(`Seeding initial UserProgress for user ${savedUser.user_id}`);
      const seed = [
        { level_id: 1, status: 'completed', score: 100 },
        { level_id: 2, status: 'unlocked', score: 0 },
        { level_id: 3, status: 'locked', score: 0 },
        { level_id: 4, status: 'locked', score: 0 },
        { level_id: 5, status: 'locked', score: 0 },
        { level_id: 6, status: 'locked', score: 0 },
        { level_id: 7, status: 'unlocked', score: 0 },
        { level_id: 8, status: 'locked', score: 0 },
        { level_id: 9, status: 'locked', score: 0 },
        { level_id: 10, status: 'locked', score: 0 },
        { level_id: 11, status: 'locked', score: 0 },
        { level_id: 12, status: 'locked', score: 0 },
      ];

      for (const item of seed) {
        const level = await this.levelRepo.findOne({ where: { level_id: item.level_id } });
        if (!level) continue;

        const existing = await this.progressRepo.findOne({
          where: { user: { user_id: savedUser.user_id }, level: { level_id: level.level_id } },
        });
        if (existing) continue;

        // Use ProgressService.saveProgress so unlock logic runs for 'completed'
        await this.progressService.saveProgress({
          user_id: savedUser.user_id,
          level_id: level.level_id,
          status: item.status,
          score: item.score,
        } as any);
      }
    } catch (err) {
      this.logger.error('Failed seeding UserProgress', err as any);
    }

    return { message: 'Đăng ký thành công' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user by email or username
    const user = await this.usersRepository.findOne({
      where: [
        { email: email },
        { username: email }
      ]
    });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      return this.generateTokensAndSave(user);
    }
    throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('Không tải được thông tin từ Google');
    }

    const { email, name, avatar, googleId } = req.user;

    let user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      // Create new user if not exists
      user = this.usersRepository.create({
        email,
        name,
        avatar,
        googleId,
        username: email.split('@')[0], // Default username from email
      });
      const savedUser = await this.usersRepository.save(user);
      // Seed UserProgress for google-created user
      try {
        this.logger.log(`Seeding initial UserProgress for google user ${savedUser.user_id}`);
        const seed = [
          { level_id: 1, status: 'completed', score: 100 },
          { level_id: 2, status: 'unlocked', score: 0 },
          { level_id: 3, status: 'locked', score: 0 },
          { level_id: 4, status: 'locked', score: 0 },
          { level_id: 5, status: 'locked', score: 0 },
          { level_id: 6, status: 'locked', score: 0 },
          { level_id: 7, status: 'unlocked', score: 0 },
          { level_id: 8, status: 'locked', score: 0 },
          { level_id: 9, status: 'locked', score: 0 },
          { level_id: 10, status: 'locked', score: 0 },
          { level_id: 11, status: 'locked', score: 0 },
          { level_id: 12, status: 'locked', score: 0 },
        ];
        for (const item of seed) {
          const level = await this.levelRepo.findOne({ where: { level_id: item.level_id } });
          if (!level) continue;
          const existing = await this.progressRepo.findOne({
            where: { user: { user_id: savedUser.user_id }, level: { level_id: level.level_id } },
          });
          if (existing) continue;

          await this.progressService.saveProgress({
            user_id: savedUser.user_id,
            level_id: level.level_id,
            status: item.status,
            score: item.score,
          } as any);
        }
      } catch (err) {
        this.logger.error('Failed seeding UserProgress for google user', err as any);
      }
    } else if (!user.googleId) {
      // Link googleId if user exists but not linked
      user.googleId = googleId;
      if (!user.avatar) user.avatar = avatar;
      await this.usersRepository.save(user);
    }

    return this.generateTokensAndSave(user);
  }

  private async generateTokensAndSave(user: User) {
    const payload = { email: user.email, sub: user.user_id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    
    // Default 7 days
    const refreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRY || '604800', 10);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshExpiry });
    
    await this.redisClient.set(
      `refresh_token:${user.user_id}`,
      refreshToken,
      'EX',
      refreshExpiry
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.sub;
      
      const storedToken = await this.redisClient.get(`refresh_token:${userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
      }

      const user = await this.usersRepository.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      return this.generateTokensAndSave(user);
    } catch (e) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  async logout(userId: number) {
    await this.redisClient.del(`refresh_token:${userId}`);
    return { message: 'Đăng xuất thành công' };
  }

  async revokeToken(userId: number) {
    await this.redisClient.del(`refresh_token:${userId}`);
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này');
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersRepository.save(user);
    await this.mailService.sendPasswordResetEmail(email, token);

    return { message: 'Liên kết đặt lại mật khẩu đã được gửi vào email của bạn' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { resetPasswordToken: token }
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.usersRepository.save(user);
    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
