import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'Feedback content from user', example: 'Nội dung đánh giá...' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Optional display name (or "Ẩn danh")', required: false, example: 'Ẩn danh' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Optional rating 1-5', required: false, example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ description: "Moderation status: 'pending' | 'approved' | 'rejected'", required: false, example: 'pending' })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected'])
  resolved?: string;

  @ApiProperty({ description: 'Optional user id (if logged in)', required: false, example: 1 })
  @IsOptional()
  @IsInt()
  userId?: number;
}
