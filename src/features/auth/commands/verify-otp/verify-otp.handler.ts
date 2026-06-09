import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyOtpCommand } from './verify-otp.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp,OtpType } from '../../../../shared/entities/otp/otp.entity';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async execute(command: VerifyOtpCommand) {
    const { token, type } = command;
    const otp = await this.otpRepository.findOne({ where: { token } });
    if (!otp) throw new BadRequestException('Invalid or expired token');
    if (otp.isUsed) throw new BadRequestException('Token already used');
    if (otp.expiresAt < new Date())
      throw new BadRequestException('Token has expired');
    if (otp.type !== type) throw new BadRequestException('Invalid token type');
    otp.attempts += 1;
    const user = await this.userRepository.findOne({
      where: { id: otp.userId },
    });
    if (!user) throw new UnauthorizedException('User not found');

    // Activate user if registering
    if (type === OtpType.REGISTER) {
      user.isActive = true;
      await this.userRepository.save(user);
    }

    // Mark OTP as used
    otp.isUsed = true;
    await this.otpRepository.save(otp);

    // Generate JWT
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      },
      accessToken,
    };
  }
}
