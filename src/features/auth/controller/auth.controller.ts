import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import express from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/auth.dto';
import { RegisterCommand } from '../commands/register/register.command';
import { LoginCommand } from '../commands/login/login.command';
import { VerifyOtpCommand } from '../commands/verify-otp/verify-otp.command';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { OtpRateLimitGuard } from '../../../shared/guards/otp-rate-limit.guard';
import { CurrentUser } from '../../../shared/common/decorators/current-user.decorator';
import { User } from '../../../shared/entities/user/user.entity'; 

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @UseGuards(OtpRateLimitGuard)
  @ApiOperation({
    summary: 'Register new user — sends activation link to email',
  })
  register(@Body() dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterCommand(
        dto.fullName,
        dto.phoneNumber,
        dto.email,
        dto.password,
        dto.isAdmin,
        dto.isActive,
      ),
    );
  }

  @Post('login')
  @UseGuards(OtpRateLimitGuard)
  @ApiOperation({ summary: 'Login — sends login link to email' })
  login(@Body() dto: LoginDto) {
    return this.commandBus.execute(
      new LoginCommand(dto.email, dto.phoneNumber, dto.password),
    );
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify OTP token from email link' })
  async verify(
    @Query('token') token: string,
    @Query('type') type: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.commandBus.execute(
      new VerifyOtpCommand(token, type),
    );

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout — clears cookie' })
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user' })
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    };
  }
}
