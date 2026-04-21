import { ApiProperty } from '@nestjs/swagger';

export class UnlockLevelResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Progress ID',
  })
  progress_id: number;

  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  user_id: number;

  @ApiProperty({
    example: 1,
    description: 'Level ID',
  })
  level_id: number;

  @ApiProperty({
    example: 'unlocked',
    description: 'Status of the level (unlocked, locked, completed)',
  })
  status: string;

  @ApiProperty({
    example: 0,
    description: 'Score achieved',
  })
  score: number;

  @ApiProperty({
    example: null,
    description: 'Date when level was completed',
  })
  completed_at: Date | null;

  @ApiProperty({
    example: '2026-04-21T10:30:00Z',
    description: 'Created date',
  })
  created_at: Date;

  @ApiProperty({
    example: '2026-04-21T10:30:00Z',
    description: 'Updated date',
  })
  updated_at: Date;
}
