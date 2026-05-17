import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../modules/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

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

    await this.usersRepository.save(newUser);
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
      const payload = { email: user.email, sub: user.user_id };
      return {
        access_token: this.jwtService.sign(payload),
      };
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
      await this.usersRepository.save(user);
    } else if (!user.googleId) {
      // Link googleId if user exists but not linked
      user.googleId = googleId;
      if (!user.avatar) user.avatar = avatar;
      await this.usersRepository.save(user);
    }

    const payload = { email: user.email, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
