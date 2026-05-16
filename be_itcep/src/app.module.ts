import { Module } from '@nestjs/common';


import { AnalyticsModule } from './modules/analytics/analytics.module';
import { LogsModule } from './modules/logs/logs.module';
// import { SessionsModule } from './modules/sessions/sessions.module';
import { ProgressModule } from './modules/progress/progress.module';
import { MediaModule } from './modules/media/media.module';
import { VillagesModule } from './modules/villages/villages.module';
import { CraftsModule } from './modules/crafts/crafts.module';
import { StepsModule } from './modules/steps/steps.module';
import { LevelsModule } from './modules/levels/levels.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './common/database.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { UserChallengesModule } from './modules/user-challenges/user-challenges.module';

@Module({
  imports: [DatabaseModule,UsersModule, AuthModule, LevelsModule, StepsModule, CraftsModule, VillagesModule, MediaModule, FeedbackModule, ProgressModule, LogsModule, AnalyticsModule, UserChallengesModule],
  

})
export class AppModule {}
