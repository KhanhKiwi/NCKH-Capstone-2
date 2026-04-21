import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnlockLevelDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the level to unlock',
  })
  @IsNotEmpty()
  @IsNumber()
  level_id: number;
}
