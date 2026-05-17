import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { GetUser } from './get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        username: 'user123',
        password: 'password123',
        name: 'Nguyen Van A',
      },
    },
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'password123',
      },
    },
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshDto })
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refresh_token);
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  logout(@GetUser('userId') userId: number) {
    return this.authService.logout(userId);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
      },
    },
  })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({
    schema: {
      example: {
        token: 'reset-token-123',
        password: 'newPassword123',
      },
    },
  })
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const { access_token } = await this.authService.googleLogin(req);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/login?token=${access_token}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/login?error=Google login failed`);
    }
  }
}
