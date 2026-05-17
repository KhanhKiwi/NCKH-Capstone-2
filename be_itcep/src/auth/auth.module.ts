import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserProgress } from '../modules/progress/entities/user-progress.entity';
import { Level } from '../modules/levels/entities/level.entity';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { MailService } from '../common/mail/mail.service';
import { ProgressModule } from '../modules/progress/progress.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../common/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProgress, Level]),
    ProgressModule,
    PassportModule,
    ConfigModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secretKey',
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule {}
