import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserChallengeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  craft_id: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  time?: number;
}
