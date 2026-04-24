import { Controller, Post, Body, Get, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ProgressService } from './progress.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
	constructor(private readonly progressService: ProgressService) {}

	@Post()
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: 'Create or update user progress' })
	@ApiBody({
		schema: {
			example: {
				user_id: 1,
				level_id: 2,
				status: 'completed',
				score: 95,
			},
		},
	})
	async save(@Body() dto: CreateProgressDto) {
		return this.progressService.saveProgress(dto);
	}

	@Get('user/:id')
	async getForUser(@Param('id', ParseIntPipe) id: number) {
		return this.progressService.getProgressForUser(id);
	}
}
