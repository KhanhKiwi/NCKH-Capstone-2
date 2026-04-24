import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('media')
@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post()
	@ApiOperation({ summary: 'Create media' })
	@ApiBody({
		schema: {
			example: {
				village_id: 1,
				url: 'https://example.com/media.jpg',
			},
		},
	})
	create(@Body() dto: any) {
		return this.mediaService.create(dto);
	}

	@Get()
	findAll() {
		return this.mediaService.findAll();
	}

	@Get('village/:villageId')
	@ApiOperation({ summary: 'Get media by village id' })
	findByVillage(@Param('villageId', ParseIntPipe) villageId: number) {
		return this.mediaService.findByVillage(villageId);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.mediaService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.mediaService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.mediaService.remove(id);
	}
}
