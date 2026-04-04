import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { StepsService } from './steps.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('steps')
@Controller('steps')
export class StepsController {
	constructor(private readonly stepsService: StepsService) {}

	@Post()
	@ApiOperation({ summary: 'Create step' })
	create(@Body() dto: any) {
		return this.stepsService.create(dto);
	}

	@Get()
	findAll() {
		return this.stepsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.stepsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
		return this.stepsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.stepsService.remove(id);
	}
}
