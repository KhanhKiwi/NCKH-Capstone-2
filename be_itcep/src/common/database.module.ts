import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// IMPORT ENTITIES CỦA BẠN
import { User } from '../modules/users/entities/user.entity';
import { UserProgress } from '../modules/progress/entities/user-progress.entity';
import { UserChallenge } from '../modules/user-challenges/entities/user-challenge.entity';
import { Level } from '../modules/levels/entities/level.entity';
import { Step } from '../modules/steps/entities/step.entity';
import { Craft } from '../modules/crafts/entities/craft.entity';
import { CraftVillage } from '../modules/villages/entities/craft-village.entity';
import { Media } from '../modules/media/entities/media.entity';
import { PlayerSession } from '../modules/sessions/entities/player-session.entity';
import { UserActionLog } from '../modules/logs/entities/user-action-log.entity';
import { AnalyticsEvent } from '../modules/analytics/entities/analytics-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3307),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASS', ''),
        database: configService.get<string>('DB_NAME', 'itcep_db'),

        entities: [
          User,
          UserProgress,
          UserChallenge,
          Level,
          Step,
          Craft,
          CraftVillage,
          Media,
          PlayerSession,
          UserActionLog,
          AnalyticsEvent,
        ],

        synchronize: false, // Đặt thành false trong production để tránh mất dữ liệu
        logging: ['error', 'warn'],
      }),
    }),
  ],
})
export class DatabaseModule { }
