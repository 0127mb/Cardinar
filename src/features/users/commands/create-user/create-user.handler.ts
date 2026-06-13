import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly User: Repository<User>,
  ) { }
  async execute(command: CreateUserCommand) {
    const { fullName, password, phoneNumber } = command;
    const existing = await this.User.findOne({
      where: { phoneNumber },
    });
    if (existing) {
      throw new ConflictException('User with this phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.User.create({
      fullName,
      phoneNumber,
      password: hashedPassword,
      isAdmin: command.isAdmin,
      isActive: command.isActive, 
    });
    const savedUser = await this.User.save(user);
    return {
      id: savedUser.id,
      fullName: savedUser.fullName,
      phoneNumber: savedUser.phoneNumber,
      profileImage: savedUser.profileImage,
      isAdmin: savedUser.isAdmin,
      isActive: savedUser.isActive,
    };
  }
}
