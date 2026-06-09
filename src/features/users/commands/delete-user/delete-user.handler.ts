import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.user.findOne({
      where: { id: command.id },
    });
    if (!user) throw new UnauthorizedException('User not found');
    await this.user.softRemove(user);
  }
}
