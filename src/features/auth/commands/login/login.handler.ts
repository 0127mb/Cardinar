import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import argon2 from 'argon2';
import { Otp, OtpType } from '../../../../shared/entities/otp/otp.entity';
import { MailService } from '../../../../shared/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(Otp)
    private readonly otp: Repository<Otp>,
    private readonly mailService: MailService,
  ) {}
  async execute(command: LoginCommand): Promise<any> {
    const { phoneNumber, email, password } = command;
    const exist = await this.user.findOne({
      where: [{ email }, { phoneNumber }],
    });
    if (!exist) {
      throw new UnauthorizedException('invalid credentials');
    }
    const hashPassword = await argon2.verify(exist.password, password);
    if (!hashPassword) {
      throw new UnauthorizedException('invalid credentials');
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const otp = this.otp.create({
      userId: exist.id,
      token,
      type: OtpType.LOGIN,
      expiresAt,
    });
    await this.otp.save(otp);
    await this.mailService.sendOtpLink(
      exist.email,
      exist.fullName,
      otp.token,
      'login',
    );

    return {
      user: {
        id: exist.id,
        fullName: exist.fullName,
        email: exist.email,
        isAdmin: exist.isAdmin,
        phoneNumber: exist.phoneNumber,
        profileImage: exist.profileImage,
      },
      token: otp.token,
      accessToken: otp.token,
      verificationToken: otp.token,
      message: 'Login link sent to your email.',
    };
  }
}
