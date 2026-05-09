import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'Feedback text from user' })
  @IsString()
  feedbackText: string;

  @ApiProperty({ description: 'Optional user id', required: false })
  @IsOptional()
  @IsInt()
  userId?: number;
}
