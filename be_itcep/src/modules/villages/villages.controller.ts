import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { VillagesService } from './villages.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('villages')
@Controller('villages')
export class VillagesController {
	constructor(private readonly villagesService: VillagesService) {}

	@Post()
	@ApiOperation({ summary: 'Create village' })
	create(@Body() dto: any) {
		return this.villagesService.create(dto);
	}

	@Get()
	findAll() {
		return this.villagesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.villagesService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.villagesService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.villagesService.remove(id);
	}
}
