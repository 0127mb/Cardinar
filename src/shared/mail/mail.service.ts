import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpLink(
    email: string,
    fullName: string,
    token: string,
    type: 'register' | 'login',
  ) {
    const frontendUrl = process.env.FRONTEND_URL ;
    const link = `${frontendUrl}/features/authentication/verify?token=${token}&type=${type}`;

    await this.mailerService.sendMail({
      to: email,
      subject:
        type === 'register' ? 'Activate your account' : 'Login to your account',
      template: './otp',
      context: {
        fullName,
        link,
        type,
      },
    });
  }
}
