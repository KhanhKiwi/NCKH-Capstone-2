import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(email: string, passwordHash: string, name: string) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmailOrUsername(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Since FE uses "name" for display name, but hasn't updated its register form payload for username,
    // we use 'name' as both 'username' and 'name' to satisfy the requirement of "login by username".
    const username = name;

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(passwordHash, salt);

    const user = await this.usersService.create({
      email,
      username,
      name,
      password,
    });

    return {
      message: 'Registration successful',
      user_id: user.user_id,
    };
  }

  async login(identifier: string, pass: string) {
    const user = await this.usersService.findByEmailOrUsername(identifier);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.user_id, username: user.username, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const { email, name, avatar } = req.user;
    let user = await this.usersService.findByEmailOrUsername(email);
    
    if (!user) {
      // Create new user for google auth
      user = await this.usersService.create({
        email,
        username: email.split('@')[0], // a unique fallback
        name,
        avatar,
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
      });
    }

    const payload = { sub: user.user_id, username: user.username, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
