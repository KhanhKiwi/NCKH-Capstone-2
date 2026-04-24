import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CraftsService } from './crafts.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('crafts')
@Controller('crafts')
export class CraftsController {
	constructor(private readonly craftsService: CraftsService) {}

	@Post()
	@ApiOperation({ summary: 'Create craft' })
	@ApiBody({
		schema: {
			example: {
				name: 'Nặn gốm',
				description: 'Craft truyền thống của làng gốm',
				village_id: 1,
			},
		},
	})
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
	@ApiBody({
		schema: {
			example: {
				name: 'Nặn gốm',
				description: 'Cập nhật tên và mô tả craft',
				village_id: 1,
			},
		},
	})
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.craftsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.craftsService.remove(id);
	}
}
