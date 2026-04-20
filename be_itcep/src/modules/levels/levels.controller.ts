import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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
	findAll() {
		return this.levelsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.levelsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.levelsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.levelsService.remove(id);
	}
}
