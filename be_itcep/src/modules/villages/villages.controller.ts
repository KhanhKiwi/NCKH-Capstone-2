import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { VillagesService } from './villages.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('villages')
@Controller('villages')
export class VillagesController {
	constructor(private readonly villagesService: VillagesService) {}

	@Post()
	@ApiOperation({ summary: 'Create village' })
	@ApiBody({
		schema: {
			example: {
				name: 'Làng gốm Bát Tràng',
				description: 'Làng nghề truyền thống về gốm sứ',
				image: 'https://example.com/village.jpg',
				city: 'Hà Nội',
			},
		},
	})
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
	@ApiBody({
		schema: {
			example: {
				name: 'Làng gốm Bát Tràng',
				description: 'Cập nhật mô tả mới',
				image: 'https://example.com/village-new.jpg',
				city: 'Hà Nội',
			},
		},
	})
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.villagesService.update(id, dto);
	}

	@Patch(':id/open')
	@ApiOperation({ summary: 'Set village open/closed status' })
	@ApiBody({
		schema: {
			example: {
				open: true,
			},
		},
	})
	setOpen(
		@Param('id', ParseIntPipe) id: number,
		@Body('open') open: boolean,
	) {
		return this.villagesService.setOpenStatus(id, open);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.villagesService.remove(id);
	}
}
