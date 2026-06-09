import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { ConflictException } from '@nestjs/common';
import { OtpType,Otp } from '../../../../shared/entities/otp/otp.entity'; 
import { MailService } from '../../../../shared/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(Otp) private readonly otp: Repository<Otp>,
    private readonly MailService: MailService,
  ) {}
  async execute(command: RegisterCommand): Promise<any> {
    const { fullName, email, password, phoneNumber, isAdmin, isActive } = command;
    const existing = await this.user.findOne({
      where: [{ phoneNumber }],
    });
    if (existing) {
      throw new ConflictException('the user given information already axist');
    }
    const haashedPassword = await argon2.hash(password);
    const createUser = this.user.create({
      fullName,
      phoneNumber,
      email,
      password: haashedPassword,
      isAdmin,
      isActive,
    });
    const save = await this.user.save(createUser);
    const otpToken = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const otp = this.otp.create({
      userId: save.id,
      token: otpToken,
      type: OtpType.REGISTER,
      expiresAt,
    });
    await this.otp.save(otp);
    await this.MailService.sendOtpLink(email, fullName, otp.token, 'register');

    return {
      user: {
        id: save.id,
        fullName: save.fullName,
        email: save.email,
        phoneNumber: save.phoneNumber,
        profileImage: save.profileImage,
        isAdmin: save.isAdmin,
        isActive: save.isActive,
      },
      token: otp.token,
      accessToken: otp.token,
      verificationToken: otp.token,
      message:
        'Registration successful. Please check your email to activate your account.',
    };
  }
}
