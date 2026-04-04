import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { LogsService } from './logs.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class LogsController {
	constructor(private readonly logsService: LogsService) {}

	@Post()
	@ApiOperation({ summary: 'Create log' })
	create(@Body() dto: any) {
		return this.logsService.create(dto);
	}

	@Get()
	findAll() {
		return this.logsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.logsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.logsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.logsService.remove(id);
	}
}
