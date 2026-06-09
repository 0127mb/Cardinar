import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import argon2 from 'argon2';
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly User: Repository<User>,
  ) { }
  async execute(command: CreateUserCommand): Promise<User> {
    const { fullName, email, password, phoneNumber } = command;
    const existing = await this.User.findOne({
      where: [ { phoneNumber }],
    });
    if (existing) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.User.create({
      fullName,
      phoneNumber,
      email,
      password: hashedPassword,
      isAdmin: command.isAdmin,
      isActive: command.isActive, 
    });
    return this.User.save(user);
  }
}
