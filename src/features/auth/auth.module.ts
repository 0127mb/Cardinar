import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../shared/entities/user/user.entity'; 
import { AuthController } from './controller/auth.controller';
import { RegisterHandler } from './commands/register/register.handler';
import { LoginHandler } from './commands/login/login.handler';
import { JwtStrategy } from './strategies/jwt.strategy';

const CommandHandlers = [RegisterHandler, LoginHandler];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as never,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
