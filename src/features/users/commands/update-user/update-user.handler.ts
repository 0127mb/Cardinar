import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import  argon2  from 'argon2';
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly User: Repository<User>,
  ) {}
  async execute(command: UpdateUserCommand): Promise<User> {
    const { id, password, isAdmin, isActive,phoneNumber,email } = command;
    const user = await this.User.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('User not verified');
    }
    if (password) {
      user['password'] = await argon2.hash(password);
    }
    Object.assign(user, { password,isAdmin, isActive, phoneNumber, email });
    return this.User.save(user); 
  }
}
