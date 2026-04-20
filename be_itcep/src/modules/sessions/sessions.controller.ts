import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
	constructor(private readonly sessionsService: SessionsService) {}

	@Post()
	@ApiOperation({ summary: 'Create session' })
	create(@Body() dto: any) {
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
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.sessionsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.sessionsService.remove(id);
	}
}
