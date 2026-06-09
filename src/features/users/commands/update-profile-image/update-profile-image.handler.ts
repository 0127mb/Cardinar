import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../shared/entities/user/user.entity';
import { UpdateProfileImageCommand } from './update-profile-image.command';

@CommandHandler(UpdateProfileImageCommand)
export class UpdateProfileImageHandler
  implements ICommandHandler<UpdateProfileImageCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async execute(command: UpdateProfileImageCommand): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: command.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profileImage = command.profileImage;
    return this.usersRepository.save(user);
  }
}
