import { Module } from '@nestjs/common';


import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { ProgressModule } from './modules/progress/progress.module';
import { MediaModule } from './modules/media/media.module';
import { VillagesModule } from './modules/villages/villages.module';
import { CraftsModule } from './modules/crafts/crafts.module';
import { LevelsModule } from './modules/levels/levels.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './common/database.module';
import { FeedbackModule } from './modules/feedback/feedback.module';

@Module({
  imports: [DatabaseModule,UsersModule, AuthModule, LevelsModule, CraftsModule, VillagesModule, MediaModule, ProgressModule, SessionsModule, AnalyticsModule],

})
export class AppModule {}
