import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand) {
    const { phoneNumber, password } = command;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.phoneNumber = :phoneNumber', { phoneNumber })
      .getOne();

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new HttpException('Account is inactive', HttpStatus.UNAUTHORIZED);
    }

    const usesLegacyArgonHash = user.password.startsWith('$argon2');
    const passwordMatches = usesLegacyArgonHash
      ? await argon2.verify(user.password, password)
      : await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (usesLegacyArgonHash) {
      user.password = await bcrypt.hash(password, 12);
      await this.userRepository.save(user);
    }

    const accessToken = this.jwtService.sign({
      userId: user.id,
      phoneNumber: user.phoneNumber,
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      },
      accessToken,
    };
  }
}
