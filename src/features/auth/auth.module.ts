import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../shared/entities/user/user.entity'; 
import { Otp } from '../../shared/entities/otp/otp.entity'; 
import { AuthController } from './controller/auth.controller';
import { RegisterHandler } from './commands/register/register.handler';
import { LoginHandler } from './commands/login/login.handler';
import { VerifyOtpHandler } from './commands/verify-otp/verify-otp.handler';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../../shared/mail/mail.module';
import { OtpRateLimitGuard } from '../../shared/guards/otp-rate-limit.guard';

const CommandHandlers = [RegisterHandler, LoginHandler, VerifyOtpHandler];
//@ts-ignore

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    MailModule,
    TypeOrmModule.forFeature([User, Otp]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      //@ts-ignore
      inject: [ConfigService],
      //@ts-ignore
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, JwtStrategy, OtpRateLimitGuard],
  exports: [JwtModule],
})
export class AuthModule {}
