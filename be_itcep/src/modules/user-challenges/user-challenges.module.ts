import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChallengesController } from './user-challenges.controller';
import { UserChallengesService } from './user-challenges.service';
import { UserChallenge } from './entities/user-challenge.entity';
import { User } from '../users/entities/user.entity';
import { Craft } from '../crafts/entities/craft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserChallenge, User, Craft])],
  controllers: [UserChallengesController],
  providers: [UserChallengesService],
  exports: [UserChallengesService],
})
export class UserChallengesModule {}
