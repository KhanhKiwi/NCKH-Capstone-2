import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { UnlockLevelDto } from './dto/unlock-level.dto';
import { UnlockLevelResponseDto } from './dto/unlock-level.response';

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
	constructor(private readonly levelsService: LevelsService) {}

	@Post()
	@ApiOperation({ summary: 'Create level' })
	create(@Body() dto: any) {
		return this.levelsService.create(dto);
	}

	@Get()
	findAll(@Query('user_id') userId?: string) {
		const uid = userId ? Number(userId) : undefined
		return this.levelsService.findAll(uid)
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number, @Query('user_id') userId?: string) {
		const uid = userId ? Number(userId) : undefined
		return this.levelsService.findOne(id, uid);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.levelsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.levelsService.remove(id);
	}

	@Post(':levelId/unlock')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ 
		summary: 'Unlock a level for the current user',
		description: 'Unlocks a specific level for the authenticated user. Creates or updates user progress record.',
	})
	@ApiParam({ name: 'levelId', description: 'ID of the level to unlock', required: true, example: 1 })
	@ApiResponse({
		status: 200,
		description: 'Level unlocked successfully',
		type: UnlockLevelResponseDto,
		example: {
			progress_id: 1,
			user_id: 1,
			level_id: 1,
			status: 'unlocked',
			score: 0,
			completed_at: null,
			created_at: '2026-04-21T10:30:00Z',
			updated_at: '2026-04-21T10:30:00Z',
		},
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized - Missing or invalid authentication token',
	})
	@ApiResponse({
		status: 400,
		description: 'Bad request - Level not found or invalid input',
	})
	async unlockLevel(
		@Param('levelId', ParseIntPipe) levelId: number,
		@GetUser('user_id') userId: number,
	) {
		return this.levelsService.unlockLevel(userId, levelId);
	}
}
