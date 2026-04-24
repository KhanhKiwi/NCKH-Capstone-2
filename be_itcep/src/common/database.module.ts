import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// IMPORT ENTITIES CỦA BẠN
import { User } from '../modules/users/entities/user.entity';
import { UserProgress } from '../modules/progress/entities/user-progress.entity';
import { Level } from '../modules/levels/entities/level.entity';
import { Craft } from '../modules/crafts/entities/craft.entity';
import { CraftVillage } from '../modules/villages/entities/craft-village.entity';
import { Media } from '../modules/media/entities/media.entity';
import { PlayerSession } from '../modules/sessions/entities/player-session.entity';
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
          Level,
          Craft,
          CraftVillage,
          Media,
          PlayerSession,
          AnalyticsEvent,
        ],

        synchronize: true,
        logging: ['error', 'warn'],
      }),
    }),
  ],
})
export class DatabaseModule { }
