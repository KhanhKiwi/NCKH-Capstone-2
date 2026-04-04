import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CraftsService } from './crafts.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('crafts')
@Controller('crafts')
export class CraftsController {
	constructor(private readonly craftsService: CraftsService) {}

	@Post()
	@ApiOperation({ summary: 'Create craft' })
	create(@Body() dto: any) {
		return this.craftsService.create(dto);
	}

	@Get()
	findAll() {
		return this.craftsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.craftsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.craftsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.craftsService.remove(id);
	}
}
