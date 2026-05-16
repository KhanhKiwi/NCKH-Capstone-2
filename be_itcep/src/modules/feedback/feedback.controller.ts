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
  @ApiBody({
    type: CreateFeedbackDto,
    schema: {
      example: {
        content: 'Nội dung đánh giá...',
        name: 'Ẩn danh',
        rating: 5,
        userId: null
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback created',
    schema: {
        example: {
        feedback_id: 1,
        feedback_text: "Ứng dụng rất hữu ích, cảm ơn team!",
        content: 'Ứng dụng rất hữu ích, cảm ơn team!',
        name: 'Nguyễn Văn A',
        rating: 5,
        resolved: 'pending',
        created_at: '2026-05-15T10:00:00.000Z',
        updated_at: '2026-05-15T10:00:00.000Z',
        user: { user_id: 1, name: 'Nguyễn Văn A', email: 'a@example.com' }
      }
    }
  })
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiResponse({
    status: 200,
    description: 'List of feedbacks',
    schema: {
      example: [
        {
          feedback_id: 1,
          feedback_text: 'Ứng dụng rất hữu ích, cảm ơn team!',
          content: 'Ứng dụng rất hữu ích, cảm ơn team!',
          name: 'Nguyễn Văn A',
          rating: 5,
          resolved: 'pending',
          created_at: '2026-05-15T10:00:00.000Z',
          user: { user_id: 1, name: 'Nguyễn Văn A' }
        },
        {
          feedback_id: 2,
            feedback_text: 'Gặp lỗi khi mở trang làng',
            content: 'Gặp lỗi khi mở trang làng, ảnh không hiển thị.',
            name: 'Trần Thị B',
            rating: 3,
            resolved: 'pending',
            created_at: '2026-05-15T10:05:00.000Z',
            user: { user_id: 2, name: 'Trần Thị B' }
        }
      ]
    }
  })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by id' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Feedback found',
    schema: {
      example: {
      feedback_id: 1,
      feedback_text: 'Ứng dụng rất hữu ích, cảm ơn team!',
      content: 'Ứng dụng rất hữu ích, cảm ơn team!',
      name: 'Nguyễn Văn A',
      rating: 5,
      resolved: 'pending',
      created_at: '2026-05-15T10:00:00.000Z',
      user: { user_id: 1, name: 'Nguyễn Văn A' }
    }
    }
  })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feedback (e.g., mark resolved)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Feedback updated',
    schema: { example: { feedback_id: 1, resolved: 'approved' } }
  })
  update(@Param('id') id: string, @Body() dto: Partial<any>) {
    return this.feedbackService.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft) feedback' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Feedback deleted', schema: { example: { affected: 1 } } })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(Number(id));
  }
}
