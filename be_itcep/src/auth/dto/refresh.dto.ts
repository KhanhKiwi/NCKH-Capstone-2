import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({ example: 'some-refresh-token' })
  @IsString()
  @IsNotEmpty()
  refresh_token!: string;
}
