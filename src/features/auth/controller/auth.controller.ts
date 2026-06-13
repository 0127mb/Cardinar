import {
  Body,
  Controller,
  Get,
  Post,
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
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { CurrentUser } from '../../../shared/common/decorators/current-user.decorator';
import { User } from '../../../shared/entities/user/user.entity'; 

type AuthResult = {
  accessToken: string;
  user: {
    id: number;
    fullName: string;
    phoneNumber: string;
    profileImage?: string;
    isAdmin: boolean;
    isActive: boolean;
  };
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @ApiOperation({ summary: 'Register and start an authenticated session' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.commandBus.execute<RegisterCommand, AuthResult>(
      new RegisterCommand(
        dto.fullName,
        dto.phoneNumber,
        dto.password,
      ),
    );
    this.setAccessTokenCookie(response, result.accessToken);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with phone number and password' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.commandBus.execute<LoginCommand, AuthResult>(
      new LoginCommand(dto.phoneNumber, dto.password),
    );
    this.setAccessTokenCookie(response, result.accessToken);
    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout — clears cookie' })
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
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
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    };
  }

  private setAccessTokenCookie(
    response: express.Response,
    accessToken: string,
  ): void {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
}
