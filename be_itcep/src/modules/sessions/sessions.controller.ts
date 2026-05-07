import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
	constructor(private readonly sessionsService: SessionsService) {}

	@Post()
	@ApiOperation({ summary: 'Create session' })
	@ApiBody({
		schema: {
			example: {
				user_id: 1,
				craft_id: 2,
				start_time: '2026-04-20T08:00:00.000Z',
			},
		},
	})
	create(@Body() dto: any) {
		// accept craft_id in payload and map to relation object for TypeORM
		if (dto?.craft_id) {
			dto.craft = { craft_id: dto.craft_id }
			delete dto.craft_id
		}
		return this.sessionsService.create(dto);
	}

	@Get()
	findAll() {
		return this.sessionsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.sessionsService.findOne(id);
	}

	@Patch(':id')
	@ApiBody({
		schema: {
			example: {
				end_time: '2026-04-20T08:30:00.000Z',
				total_time: 1800,
			},
		},
	})
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		if (dto?.craft_id) {
			dto.craft = { craft_id: dto.craft_id }
			delete dto.craft_id
		}
		return this.sessionsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.sessionsService.remove(id);
	}
}
