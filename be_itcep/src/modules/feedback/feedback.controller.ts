import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create feedback' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({ status: 201, description: 'Feedback created' })
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiResponse({ status: 200, description: 'List of feedbacks' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by id' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Feedback found' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feedback (e.g., mark resolved)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Feedback updated' })
  update(@Param('id') id: string, @Body() dto: Partial<any>) {
    return this.feedbackService.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft) feedback' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Feedback deleted' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(Number(id));
  }
}
