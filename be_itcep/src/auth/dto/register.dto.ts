import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsOptional()
  @IsString()
  name?: string;
}
