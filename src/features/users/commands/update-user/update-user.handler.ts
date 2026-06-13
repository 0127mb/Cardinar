import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly User: Repository<User>,
  ) {}
  async execute(command: UpdateUserCommand) {
    const { id, password, fullName, isAdmin, isActive, phoneNumber } = command;
    const user = await this.User.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (isActive !== undefined) user.isActive = isActive;

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
