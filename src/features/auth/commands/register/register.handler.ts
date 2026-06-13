import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RegisterCommand) {
    const { fullName, password, phoneNumber } = command;
    const existing = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (existing) {
      throw new HttpException(
        'User with this phone number already exists',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      isAdmin: false,
      isActive: true,
    });
    const savedUser = await this.userRepository.save(user);
    const accessToken = this.jwtService.sign({
      userId: savedUser.id,
      phoneNumber: savedUser.phoneNumber,
    });

    return {
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        phoneNumber: savedUser.phoneNumber,
        profileImage: savedUser.profileImage,
        isAdmin: savedUser.isAdmin,
        isActive: savedUser.isActive,
      },
      accessToken,
    };
  }
}
