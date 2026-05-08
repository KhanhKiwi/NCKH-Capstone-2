import { Controller, Post, Body, Get, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserChallengeDto } from './dto/create-user-challenge.dto';
import { UserChallengesService } from './user-challenges.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('user-challenges')
@Controller('user-challenges')
export class UserChallengesController {
  constructor(private readonly service: UserChallengesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create or update user challenge result' })
  @ApiBody({
    schema: {
      example: { user_id: 1, craft_id: 2, time: 120 },
    },
  })
  async save(@Body() dto: CreateUserChallengeDto) {
    return this.service.saveChallenge(dto);
  }

  @Get('user/:id')
  async getForUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.getForUser(id);
  }

  @Get('craft/:id/leaderboard')
  async getLeaderboard(@Param('id', ParseIntPipe) id: number) {
    return this.service.getLeaderboardForCraft(id);
  }
}
